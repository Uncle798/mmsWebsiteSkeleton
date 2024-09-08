import  prisma from "$lib/server/prisma";
import { anvilClient, leaseTemplateId } from "$lib/server/anvil";
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
//@ts-ignore: it works
import type { Actions, PageServerLoad } from './$types';
import {superValidate, message } from 'sveltekit-superforms';
import z from 'zod';
import { zod } from 'sveltekit-superforms/adapters';
import { error, redirect } from "@sveltejs/kit";
import type { Unit, UnitPricing } from "@prisma/client";
import type { PartialUser } from "$lib/server/partialTypes";

const newLeaseSchema = z.object({
   contactInfoId: z.string().min(23).max(30),
   unitPriceId: z.string().min(23).max(30),
   unitNum: z.string().min(23).max(30),
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
         }) || {} as Unit;
      }
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

function getPacketVariable(customer:PartialUser, unitPrice:UnitPricing, unit:Unit, employee:PartialUser){
   return {
      isDraft: false,
      isTest: true,
      webhookURL: 'https://' + process.env.VERCEL_URL + '/units/newLease',
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
                  'customerName':customer.givenName + ' ' + customer.familyName,
                  'companyName': process.env.PUBLIC_COMPANY_NAME,
                  'leaseEffectiveDate': Date.now(),
                  'unitNum': unit.num.replace(/^0+/gm,''),
                  'size': unit.size,
                  'price': unitPrice.price
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
                  fieldId: 'customerSignDate'
               },
               {
                  fileId: 'leaseTemplate',
                  fieldId: 'customerSign', 
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
                  fieldId: 'companySignDate',
               },
               {
                  fileId: 'leaseTemplate',
                  fieldId: 'companySign'
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

      const variables = getPacketVariable( customer!, unitPrice!, unit!, employee! );
      console.log(variables)
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
