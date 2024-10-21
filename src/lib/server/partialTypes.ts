import { Prisma } from "@prisma/client/edge"

export const partialUser = Prisma.validator<Prisma.UserDefaultArgs>()({
   select:{
      email: true,
      givenName: true,
      familyName: true, 
      organizationName: true,
      id: true,
      employee: true,
      admin: true,
   }
})

export type PartialUser = Prisma.UserGetPayload<typeof partialUser>

export const partialContactInfo = Prisma.validator<Prisma.ContactInfoDefaultArgs>()({
   select: {
      address1: true,
      city: true,
      state: true,
      zip: true,
      country: true,
      phoneNum1: true, 
      phoneNum1Country: true,
      userId: true,
   }
})
export type PartialContactInfo = Prisma.ContactInfoGetPayload<typeof partialContactInfo>

export const partialLease = Prisma.validator<Prisma.LeaseDefaultArgs>()({
   select: {
      customerId: true,
      employeeId: true,
      contactInfoId: true,
      unitNum: true,
      price: true,
      leaseEffectiveDate: true,
      leaseReturnedAt: true, 
      leaseEnded: true
   }
})
export type PartialLease = Prisma.LeaseGetPayload<typeof partialLease>

export const partialInvoice = Prisma.validator<Prisma.InvoiceDefaultArgs>()({
   select: {
      customerId: true,
      leaseId: true,
      invoiceAmount: true,
      invoiceCreated: true,
      invoiceNotes: true,
      invoicePaid: true, 
   }
})
export type PartialInvoice = Prisma.InvoiceGetPayload<typeof partialInvoice>

export const partialPaymentRecord = Prisma.validator<Prisma.PaymentRecordDefaultArgs>()({
   select: {
      paymentType: true,
      customerId: true,
      paymentAmount: true,
      receiverId: true,
      paymentCreated: true,
      paymentCompleted: true,
      invoiceId: true,
      paymentNotes: true,
   }
})
export type PartialPaymentRecord = Prisma.PaymentRecordGetPayload<typeof partialPaymentRecord>