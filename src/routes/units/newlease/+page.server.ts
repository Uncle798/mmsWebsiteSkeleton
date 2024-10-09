import  prisma from "$lib/server/prisma";

import type { Actions, PageServerLoad } from './$types';
import {superValidate, message } from 'sveltekit-superforms';
import z from 'zod';
import { zod } from 'sveltekit-superforms/adapters';
import { error, redirect } from "@sveltejs/kit";
import { ratelimit } from "$lib/server/redis";
import type { Unit } from 'prisma/prisma-client';

const newLeaseSchema = z.object({
   contactInfoId: z.string().min(23).max(30),
   unitNum: z.string().min(3).max(6),
   organization: z.boolean(),
})


export const load:PageServerLoad = (async (event) =>{
   if(!event.locals.user){
      redirect(302, '/login')
   }
   const form = await superValidate(zod(newLeaseSchema));
   const unitNum = event.url.searchParams.get('unitNum');
   console.log('newLease unit num: '+unitNum);
   if(!unitNum){
      redirect(302, '/units/available');
   }
   const unit = await prisma.unit.findUnique({
      where: {
         num: unitNum,
      }
   })
   const address = await prisma.contactInfo.findMany({
      where:{
         userId:event.locals.user.id
      }
   })
   return { form, address, unit}
})


export const actions:Actions = {
   default: async (event) =>{
      const form = await superValidate(event.request, zod(newLeaseSchema));
      if(!form.valid){
         message(form, 'no good')
      }
      const { success, reset } = await ratelimit.register.limit(event.getClientAddress())
		if(!success) {
			const timeRemaining = Math.floor((reset - Date.now()) /1000);
			return message(form, `Please wait ${timeRemaining}s before trying again.`)
		}
      const customer = await prisma.user.findUniqueOrThrow({
         where:{
            id:event.locals.user?.id
         }
      }).catch((err) =>{
         console.error(err);
      })
      const unit = await prisma.unit.findFirst({
         where:{
            num:form.data.unitNum,
         }
      }).catch((err) =>{
         console.error(err);
      })
      const currentLease = await prisma.lease.findFirst({
         where:{
            unitNum: unit?.num,
            leaseEnded: null,
         }
      }).catch((err) => {
         console.error(err);
      })
      if(currentLease){
         message(form, 'That unit is already leased');
      }
      const contactInfoId = form.data.contactInfoId;
      const employees = await prisma.user.findMany({
         where:{
            employee: true,
         }
      })
      const employee = employees[Math.floor(Math.random()*employees.length)];
      const lease = await prisma.lease.create({
         data:{
            customerId: customer!.id,
            employeeId: employee.id,
            unitNum: form.data.unitNum,
            price:unit!.advertisedPrice,
            contactInfoId,
            leaseEffectiveDate: new Date(),
         }
      })
      const invoice = await prisma.invoice.create({
         data:{
            invoiceAmount: lease.price,
            customerId: lease.customerId,
            leaseId: lease.leaseId,
            invoiceNotes:'Deposit for ' + lease.unitNum.replace(/^0+/gm,''), 
         }
      })
      redirect(302, '/units/newLease/payDeposit?invoiceId=' + invoice.invoiceId)
   }
}
