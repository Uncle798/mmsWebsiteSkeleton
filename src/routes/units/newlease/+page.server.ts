import  prisma from "$lib/server/prisma";
import { anvilClient, leaseTemplateId } from "$lib/server/anvil";
import type { Actions, PageServerLoad } from './$types';
import {superValidate, message } from 'sveltekit-superforms';
import z from 'zod';
import { zod } from 'sveltekit-superforms/adapters';
import { redirect } from "@sveltejs/kit";
import type GraphQLResponse from "@anvilco/anvil";
import type { Unit, UnitPricing, User } from "@prisma/client";
const newLeaseSchema = z.object({
   unitNum: z.string().min(3).max(3)
})


export const load:PageServerLoad = (async ({locals}) =>{
   if(!locals.user?.employee){
      redirect(302, '/login')
   }
   const form = await superValidate(zod(newLeaseSchema));
   const units = await prisma.unitPricing.findMany({
      orderBy:{
         unitNum: 'asc'
      },
      where:{
         leases:{
            some:{
               leaseEnded:{
                  not:null
               },
            }
         }
      }
   })
   const users = await prisma.user.findMany({
      orderBy: {
         familyName: "asc"
      }
   })
   return { form, units, users }
})

function getPacketVariable(customer:User, unitPrice:UnitPricing, unit:Unit, employee:User){
   return {
      isDraft: true,
      isTest: true,
      name: `Fake Lease ${customer.familyName}, ${customer.givenName} unit ${unit.num.replace(/^0+/gm,'')}`,
      signatureEmailSubject: `Lease for Unit ${unit.num.replace(/^0+/gm,'')} at Moscow Mini`,
      signatureEmailBody: `Hello ${customer.givenName}, please sign the attached lease for unit ${unit.num.replace(/^0+/gm,'')}`,
      files:[
         {
            id:'leaseTemplate',
            castEid: leaseTemplateId,
            filename: `Unit ${unit.num} lease for ${customer.familyName}, ${customer.givenName}.pdf`,
            title: `Unit ${unit.num} lease between ${customer.familyName}, ${customer.givenName} and ${process.env.COMPANY_NAME}`,

         }
      ],
      data: {
         payloads: {
            leaseTemplate:{
               data: {
                  'Customer Name': customer.givenName + ' ' + customer.familyName,
                  'Lease Effective Date': Date.now(),
                  'Unit Number': unit.num.replace(/^0+/gm,''),
                  'Size': unit.size,
                  'Price': unitPrice.price
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
                  fieldId: 'Customer Signature'
               },
               {
                  fileId: 'leaseTemplate',
                  fieldId: 'Customer Signature Date'
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
                  fieldId: 'Manager Signature',
               },
               {
                  fileId: 'leaseTemplate',
                  fieldId: 'Manager Signature Date'
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
      }).catch((err) =>{
         console.error(err);
      });
      const unitNum = event.url.searchParams.get('unitNum');
      const unit = await prisma.unit.findFirst({
         where:{
            num:unitNum!,
         }
      }).catch((err)=>{
         console.error(err);
      });
      const unitPrice = await prisma.unit.findFirst({
         where:{
            num: unitNum!,
         }
      }).catch((err)=>{
         console.error(err);
      });
      const employees = await prisma.user.findMany({
         where:{
            employee: true,
         }
      })
      const employee = employees[Math.floor(Math.random()*employees.length)];

      const variables = getPacketVariable(customer, unitPrice, unit, employee);
      const { statusCode, data, errors } :GraphQLResponse = await anvilClient.createEtchPacket({
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
