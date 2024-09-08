import  prisma from "$lib/server/prisma";
import { anvilClient, getOrganizationalPacketVariables, getPersonalPacketVariables } from "$lib/server/anvil";
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
//@ts-ignore: it works
import type { Actions, PageServerLoad } from './$types';
import {superValidate, message } from 'sveltekit-superforms';
import z from 'zod';
import { zod } from 'sveltekit-superforms/adapters';
import { error, redirect } from "@sveltejs/kit";
import { ratelimit } from "$lib/server/redis";
import type { Unit } from 'prisma/prisma-client';

const newLeaseSchema = z.object({
   contactInfoId: z.string().min(23).max(30),
   unitPriceId: z.string().min(23).max(30),
   unitNum: z.string().min(23).max(30),
   organization: z.boolean(),
})


export const load:PageServerLoad = (async (event) =>{
   if(!event.locals.user){
      redirect(302, '/login')
   }
   const form = await superValidate(zod(newLeaseSchema));
   if(!event.locals.user.employee){
      const unitNum = event.url.searchParams.get('unitNum');
      let unit:Unit= {} as Unit;
      if(unitNum){
         console.log('newLease +page.server: unitNum:' + unitNum);
         unit = await prisma.unit.findUnique({
            where:{
               num:unitNum,
            }
         }).catch((err) =>{
            console.error(err);
            return error(404, 'Unit not found')
         }) || {} as Unit;
      }
      console.log('newLease +page.server: unit:' + unit);
      const address = await prisma.contactInfo.findMany({
         where:{
            userId:event.locals.user.id
         }
      }).catch((err) =>{
         console.error(err);
      });
      const unitPrice = await prisma.unitPricing.findFirst({
         where:{
            endDate: null,
            unitNum: unit.num
         }
      });
      return { form, unit, address, unitPrice };
   }
   return { form }
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
      console.log(form.data);
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
      const lease = await prisma.lease.findFirst({
         where:{
            unitNum: unit?.num,
            leaseEnded: null,
         }
      })
      if(lease){
         message(form, 'That unit is already leased');
      }
      const unitPrice = await prisma.unitPricing.findUniqueOrThrow({
         where:{
            unitPricingId:form.data.unitPriceId
         }
      }).catch((err) =>{
         console.error(err);
      })
      const contactInfoId = form.data.contactInfoId;
      const employees = await prisma.user.findMany({
         where:{
            employee: true,
         }
      })
      const employee = employees[Math.floor(Math.random()*employees.length)];
      let variables ={};
      if(form.data.organization){
         variables = getOrganizationalPacketVariables( customer!, unitPrice!, unit!, employee! );
      } else {
         variables = getPersonalPacketVariables( customer!, unitPrice!, unit!, employee! );
      }
      const { data, errors } = await anvilClient.createEtchPacket({
         variables
      })
      if (errors) {
         // Note: because of the nature of GraphQL, statusCode may be a 200 even when
         // there are errors.
         console.log('There were errors!')
         console.log(JSON.stringify(errors, null, 2))
         message(form, 'Sorry there were server errors. Please try again later.')
      } else {
         const packetDetails = data?.data['createEtchPacket']
         console.log('Visit the new packet on your dashboard:', packetDetails.detailsURL)
         console.log(JSON.stringify(packetDetails, null, 2))
         await prisma.lease.create({
            data:{
               customerId: customer!.id,
               employeeId: employee.id,
               unitNum: form.data.unitNum,
               price: unitPrice!.price,
               contactInfoId,
               leaseEffectiveDate: new Date(),
               leaseId: packetDetails['eid'],
            }
         })
      }
      redirect(302, '/units/newLease/leaseSent')
   }
}
