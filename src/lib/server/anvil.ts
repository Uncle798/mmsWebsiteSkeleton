import Anvil from "@anvilco/anvil";
import { PUBLIC_COMPANY_NAME } from '$env/static/public';

import type { PartialUser } from "./partialTypes";
import type { Unit, UnitPricing } from "@prisma/client";

export const anvilClient = new Anvil({apiKey:process.env.ANVIL_API_KEY});

export const leaseTemplateId = '3ABabYkvU2ySORZ7RKrw'

export function getPersonalPacketVariables(customer:PartialUser, unitPrice:UnitPricing, unit:Unit, employee:PartialUser){
   return {
      isDraft: false,
      isTest: true,
      webhookURL: 'https://' + process.env.VERCEL_URL + '/units/newLease',
      name: `Fake Lease ${customer.familyName}, ${customer.givenName} unit ${unit.num.replace(/^0+/gm,'')}`,
      signatureEmailSubject: `Lease for Unit ${unit.num.replace(/^0+/gm,'')} at ${PUBLIC_COMPANY_NAME}`,
      signatureEmailBody: `Please sign the attached lease for unit ${unit.num.replace(/^0+/gm,'')} from ${PUBLIC_COMPANY_NAME}`,
      files:[
         {
            id:'leaseTemplate',
            castEid: leaseTemplateId,
            // filename: `Unit:${unit.num}_lease_${customer.familyName}_${customer.givenName}.pdf`,
            title: `Unit ${unit.num} lease between ${customer.familyName}, ${customer.givenName} and ${PUBLIC_COMPANY_NAME}`,

         }
      ],
      data: {
         payloads: {
            leaseTemplate:{
               data: {
                  'customerName':customer.givenName + ' ' + customer.familyName,
                  'companyName': PUBLIC_COMPANY_NAME,
                  'leaseEffectiveDate': new Date(),
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
export function getOrganizationalPacketVariables(customer:PartialUser, unitPrice:UnitPricing, unit:Unit, employee:PartialUser){
   return {
      isDraft: false,
      isTest: true,
      webhookURL: 'https://' + process.env.VERCEL_URL + '/units/newLease',
      name: `Fake Lease ${customer.organizationName} unit ${unit.num.replace(/^0+/gm,'')} at ${PUBLIC_COMPANY_NAME}`,
      signatureEmailSubject: `Lease for Unit ${unit.num.replace(/^0+/gm,'')} at ${PUBLIC_COMPANY_NAME}`,
      signatureEmailBody: `Please sign the attached lease for unit ${unit.num.replace(/^0+/gm,'')} from ${PUBLIC_COMPANY_NAME}`,
      files:[
         {
            id:'leaseTemplate',
            castEid: leaseTemplateId,
            title: `Unit ${unit.num} lease between ${customer.organizationName} and ${PUBLIC_COMPANY_NAME}`,

         }
      ],
      data: {
         payloads: {
            leaseTemplate:{
               data: {
                  'customerName':customer.organizationName,
                  'representativeName':customer.givenName + ' ' + customer.familyName,
                  'companyName': PUBLIC_COMPANY_NAME,
                  'leaseEffectiveDate': new Date(),
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