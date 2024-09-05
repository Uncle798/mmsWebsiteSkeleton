import  prisma from "$lib/server/prisma";
import { anvilClient, leaseTemplateId } from "$lib/server/anvil";
import type { Actions, PageServerLoad } from './$types';
import {superValidate, message } from 'sveltekit-superforms';
import z from 'zod';
import { zod } from 'sveltekit-superforms/adapters';
import { error, redirect } from "@sveltejs/kit";
import type { Unit, UnitPricing } from "@prisma/client";
import type { PartialUser } from "$lib/server/partialTypes";

const newLeaseSchema = z.object({
   unitNum: z.string().min(3).max(3)
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
         unit = await prisma.unit.findUnique({
            where:{
               num:unitNum,
            }
         }).catch((err) =>{
            console.error(err);
            return error(404, 'Unit not found')
         });
      }
      const address = await prisma.contactInfo.findFirst({
         where:{
            userId:event.locals.user.id
         }
      });
      const unitPrice = await prisma.unitPricing.findFirst({
         where:{
            endDate: null,
            unitNum: unit?.num
         }
      });
      return { form, unit, address, unitPrice };
   }
   return { form }
})

function getPacketVariable(customer:PartialUser, unitPrice:UnitPricing, unit:Unit, employee:PartialUser){
   return {
      isDraft: false,
      isTest: true,
      name: `Fake Lease ${customer.familyName}, ${customer.givenName} unit ${unit.num.replace(/^0+/gm,'')}`,
      signatureEmailSubject: `Lease for Unit ${unit.num.replace(/^0+/gm,'')} at ${process.env.PUBLIC_COMPANY_NAME}`,
      signatureEmailBody: `Hello ${customer.givenName}, please sign the attached lease for unit ${unit.num.replace(/^0+/gm,'')}`,
      files:[
         {
            id:'leaseTemplate',
            castEid: leaseTemplateId,
            // filename: `Unit:${unit.num}_lease_${customer.familyName}_${customer.givenName}.pdf`,
            title: `Unit ${unit.num} lease between ${customer.familyName}, ${customer.givenName} and ${process.env.PUBLIC_COMPANY_NAME}`,

         }
      ],
      data: {
         payloads: {
            leaseTemplate:{
               data: {
                  'fielddba6ff096bb211ef892b8f8f688ede64':customer.givenName + ' ' + customer.familyName,
                  'fielddba6ff086bb211ef892b8f8f688ede64': process.env.PUBLIC_COMPANY_NAME,
                  'fielddba6ff076bb211ef892b8f8f688ede64': Date.now(),
                  'fielddba6ff066bb211ef892b8f8f688ede64': unit.num.replace(/^0+/gm,''),
                  'fielddba6ff056bb211ef892b8f8f688ede64': unit.size,
                  'fielddba6ff046bb211ef892b8f8f688ede64': unitPrice.price
               }
            }
         }
      },
      signers: [
         {
            id: 'customer', 
            name: `${customer.givenName} ${customer.familyName}`,
            email: customer.email,
            signerType: 'email',
            fields: [
               {
                  fileId: 'leaseTemplate',
                  fieldId: 'fielddba6ff036bb211ef892b8f8f688ede64'
               },
               {
                  fileId: 'leaseTemplate',
                  fieldId: 'fielddba6ff026bb211ef892b8f8f688ede64', 
               }

            ]
         },
         {
            id: 'manager',
            name: `${employee.givenName, employee.familyName}`,
            email: employee.email,
            signerType: 'email',
            fields: [
               {
                  fileId: 'leaseTemplate',
                  fieldId: 'fielddba6ff016bb211ef892b8f8f688ede64',
               },
               {
                  fileId: 'leaseTemplate',
                  fieldId: 'fielddba6ff006bb211ef892b8f8f688ede64'
               }
            ]
         }
      ]
   }
}

export const actions:Actions = {
   default: async (event) =>{
      const form = await superValidate(event.request, zod(newLeaseSchema));
      if(!form.valid){
         message(form, 'no good')
      }
      const customer = await prisma.user.findUniqueOrThrow({
         where:{
            id:event.locals.user?.id
         }
      })
      const unitNum = event.url.searchParams.get('unitNum');
      const unit = await prisma.unit.findFirst({
         where:{
            num:unitNum!,
         }
      })
      const unitPrice = await prisma.unitPricing.findFirst({
         where:{
            unitNum: unitNum!,
         }
      })
      const employees = await prisma.user.findMany({
         where:{
            employee: true,
         }
      })
      const employee = employees[Math.floor(Math.random()*employees.length)];

      const variables = getPacketVariable( customer, unitPrice!, unit!, employee! );
      console.log(variables)
      const { statusCode, data, errors } = await anvilClient.createEtchPacket({
         variables
      })
      console.log('Finished! Status code:', statusCode) // => 200, 400, 404, etc

      if (errors) {
        // Note: because of the nature of GraphQL, statusCode may be a 200 even when
        // there are errors.
        console.log('There were errors!')
        console.log(JSON.stringify(errors, null, 2))
      } else {
        const packetDetails = data?.data['createEtchPacket']
        console.log('Visit the new packet on your dashboard:', packetDetails.detailsURL)
        console.log(JSON.stringify(packetDetails, null, 2))
      }
   }
}
