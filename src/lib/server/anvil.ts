import Anvil from "@anvilco/anvil";
import { PUBLIC_COMPANY_NAME } from '$env/static/public';
import { ANVIL_API_KEY } from "$env/static/private";
import type { PartialUser } from "./partialTypes";
import type { Lease, Unit } from "@prisma/client/edge";

export const anvilClient = new Anvil({apiKey:ANVIL_API_KEY});

export const leaseTemplateId = '3ABabYkvU2ySORZ7RKrw'

export function getPersonalPacketVariables(customer:PartialUser, lease:Lease, unit:Unit, employee:PartialUser){
   return {
      isDraft: false,
      isTest: true,
      name: `Fake Lease ${customer.familyName}, ${customer.givenName} unit ${unit.num.replace(/^0+/gm,'')}`,
      signatureEmailSubject: `Lease for Unit ${unit.num.replace(/^0+/gm,'')} at ${PUBLIC_COMPANY_NAME}`,
      signatureEmailBody: `Please sign the attached lease for unit ${unit.num.replace(/^0+/gm,'')} from ${PUBLIC_COMPANY_NAME}`,
      files:[
         {
            id:'leaseTemplate',
            castEid: leaseTemplateId,
         }
      ],
      data: {
         payloads: {
            leaseTemplate:{
               data: {
                  'customerName':customer.givenName + ' ' + customer.familyName,
                  'companyName': PUBLIC_COMPANY_NAME,
                  'leaseEffectiveDate': lease.leaseEffectiveDate,
                  'unitNum': unit.num.replace(/^0+/gm,''),
                  'size': unit.size.replace(/^0+/gm,'').replace(/x0/gm,'x'),
                  'price': lease.price
               }
            }
         }
      },
      signers: [
         {
            id: 'customer', 
            name: `${customer.givenName}, ${customer.familyName}`,
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
            name: `${employee.givenName}, ${employee.familyName}`,
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
export function getOrganizationalPacketVariables(customer:PartialUser, lease:Lease, unit:Unit, employee:PartialUser){
   return {
      isDraft: false,
      isTest: true,
      name: `Fake Lease ${customer.organizationName} unit ${unit.num.replace(/^0+/gm,'')} at ${PUBLIC_COMPANY_NAME}`,
      signatureEmailSubject: `Lease for Unit ${unit.num.replace(/^0+/gm,'')} at ${PUBLIC_COMPANY_NAME}`,
      signatureEmailBody: `Please sign the attached lease for unit ${unit.num.replace(/^0+/gm,'')} from ${PUBLIC_COMPANY_NAME}`,
      files:[
         {
            id:'leaseTemplate',
            castEid: leaseTemplateId,
         }
      ],
      data: {
         payloads: {
            leaseTemplate:{
               data: {
                  'customerName':customer.organizationName,
                  'representativeName':customer.givenName + ' ' + customer.familyName,
                  'companyName': PUBLIC_COMPANY_NAME,
                  'leaseEffectiveDate': lease.leaseEffectiveDate,
                  'unitNum': unit.num.replace(/^0+/gm,''),
                  'size': unit.size,
                  'price': lease.price
               }
            }
         }
      },
      signers: [
         {
            id: 'customer', 
            name: `${customer.givenName}, ${customer.familyName}`,
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
            name: `${employee.givenName}, ${employee.familyName}`,
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