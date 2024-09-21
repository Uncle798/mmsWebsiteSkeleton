import Anvil from "@anvilco/anvil";
import { P as PUBLIC_COMPANY_NAME } from "./public.js";
const anvilClient = new Anvil({ apiKey: process.env.ANVIL_API_KEY });
const leaseTemplateId = "3ABabYkvU2ySORZ7RKrw";
function getPersonalPacketVariables(customer, lease, unit, employee) {
  return {
    isDraft: false,
    isTest: true,
    webhookURL: "https://" + process.env.VERCEL_URL + "/units/newLease",
    name: `Fake Lease ${customer.familyName}, ${customer.givenName} unit ${unit.num.replace(/^0+/gm, "")}`,
    signatureEmailSubject: `Lease for Unit ${unit.num.replace(/^0+/gm, "")} at ${PUBLIC_COMPANY_NAME}`,
    signatureEmailBody: `Please sign the attached lease for unit ${unit.num.replace(/^0+/gm, "")} from ${PUBLIC_COMPANY_NAME}`,
    files: [
      {
        id: "leaseTemplate",
        castEid: leaseTemplateId,
        // filename: `Unit:${unit.num}_lease_${customer.familyName}_${customer.givenName}.pdf`,
        title: `Unit ${unit.num} lease between ${customer.familyName}, ${customer.givenName} and ${PUBLIC_COMPANY_NAME}`
      }
    ],
    data: {
      payloads: {
        leaseTemplate: {
          data: {
            "customerName": customer.givenName + " " + customer.familyName,
            "companyName": PUBLIC_COMPANY_NAME,
            "leaseEffectiveDate": lease.leaseEffectiveDate,
            "unitNum": unit.num.replace(/^0+/gm, ""),
            "size": unit.size,
            "price": lease.price
          }
        }
      }
    },
    signers: [
      {
        id: "customer",
        name: `${customer.givenName} ${customer.familyName}`,
        email: customer.email,
        signerType: "email",
        fields: [
          {
            fileId: "leaseTemplate",
            fieldId: "customerSignDate"
          },
          {
            fileId: "leaseTemplate",
            fieldId: "customerSign"
          }
        ]
      },
      {
        id: "manager",
        name: `${employee.givenName, employee.familyName}`,
        email: employee.email,
        signerType: "email",
        fields: [
          {
            fileId: "leaseTemplate",
            fieldId: "companySignDate"
          },
          {
            fileId: "leaseTemplate",
            fieldId: "companySign"
          }
        ]
      }
    ]
  };
}
function getOrganizationalPacketVariables(customer, lease, unit, employee) {
  return {
    isDraft: false,
    isTest: true,
    webhookURL: "https://" + process.env.VERCEL_URL + "/units/newLease",
    name: `Fake Lease ${customer.organizationName} unit ${unit.num.replace(/^0+/gm, "")} at ${PUBLIC_COMPANY_NAME}`,
    signatureEmailSubject: `Lease for Unit ${unit.num.replace(/^0+/gm, "")} at ${PUBLIC_COMPANY_NAME}`,
    signatureEmailBody: `Please sign the attached lease for unit ${unit.num.replace(/^0+/gm, "")} from ${PUBLIC_COMPANY_NAME}`,
    files: [
      {
        id: "leaseTemplate",
        castEid: leaseTemplateId,
        title: `Unit ${unit.num} lease between ${customer.organizationName} and ${PUBLIC_COMPANY_NAME}`
      }
    ],
    data: {
      payloads: {
        leaseTemplate: {
          data: {
            "customerName": customer.organizationName,
            "representativeName": customer.givenName + " " + customer.familyName,
            "companyName": PUBLIC_COMPANY_NAME,
            "leaseEffectiveDate": lease.leaseEffectiveDate,
            "unitNum": unit.num.replace(/^0+/gm, ""),
            "size": unit.size,
            "price": lease.price
          }
        }
      }
    },
    signers: [
      {
        id: "customer",
        name: `${customer.givenName} ${customer.familyName}`,
        email: customer.email,
        signerType: "email",
        fields: [
          {
            fileId: "leaseTemplate",
            fieldId: "customerSignDate"
          },
          {
            fileId: "leaseTemplate",
            fieldId: "customerSign"
          }
        ]
      },
      {
        id: "manager",
        name: `${employee.givenName, employee.familyName}`,
        email: employee.email,
        signerType: "email",
        fields: [
          {
            fileId: "leaseTemplate",
            fieldId: "companySignDate"
          },
          {
            fileId: "leaseTemplate",
            fieldId: "companySign"
          }
        ]
      }
    ]
  };
}
export {
  getPersonalPacketVariables as a,
  anvilClient as b,
  getOrganizationalPacketVariables as g
};
