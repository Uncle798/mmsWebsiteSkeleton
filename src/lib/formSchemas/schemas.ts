import { z } from "zod"

export const employeeConfirmSchema = z.object({
   employee: z.boolean().nullable(),
   admin: z.boolean().nullable(),
   userId: z.string().min(23).max(30),
});
export type EmployeeConfirmSchema = typeof employeeConfirmSchema;

export const adminConfirmSchema = z.object({
   admin: z.boolean().optional(),
   userId: z.string().min(23).max(30),
});
export type AdminConfirmSchema = typeof adminConfirmSchema;

export const pricingSchema = z.object({
   size: z.string().min(5).max(7).trim(),
   price: z.number().int().min(0).max(10000),
   lowerPrice: z.boolean().nullable(),
});
export type PricingSchema = typeof pricingSchema;

export const unitComponentSchema =  z.object({
   notes: z.string().optional(),
   unavailable: z.boolean().nullable(),
   unitNum: z.string().min(3).max(6),
});
export type  UnitComponentSchema = typeof unitComponentSchema;

export const endLeaseSchema = z.object({
   leaseId: z.string().min(23).max(30),
})
export type EndLeaseSchema = typeof endLeaseSchema;

export const newLeaseSchema = z.object({
   contactInfoId: z.string().min(23).max(30),
   unitNum: z.string().min(3).max(9),
   organization: z.boolean(),
})
export type NewLeaseSchema = typeof newLeaseSchema;

export const passwordFormSchema = z.object({
   password: z.string().min(6, 'Password must be at least 6 characters')
      .max(255,'Password can\'t be longer than 255 characters'),
   passwordConfirm: z.string().min(6, 'Password must be at least 6 characters')
      .max(255,'Password can\'t be longer than 255 characters'),
})
.superRefine(({password, passwordConfirm}, context)=>{
   if(passwordConfirm !== password){
      context.addIssue({
         code: 'custom',
         message: 'Password must match confirm password', 
         path: ['password']
      })
      context.addIssue({
         code: 'custom',
         message: 'Password must match confirm password', 
         path: ['confirmPassword']
      })
   }
});
export type PasswordFormSchema = typeof passwordFormSchema;


export const paymentRecordSchema = z.object({
   customerId: z.string(),
   invoiceId: z.string().nullable(),
   paymentAmount: z.number(),
   payee: z.string().optional(),
   unitNum: z.string().min(3).max(8).nullable(),
   paymentType: z.enum(['STRIPE', 'CASH', 'CHECK']),
   paymentNotes: z.string().optional(),
});
export type PaymentRecordSchema = typeof paymentRecordSchema

export const loginSchema = z.object({
   email: z.string().email().min(3).max(255).trim(),
   password: z.string().min(6, 'Password must be at least 6 characters')
      .max(255,'Password can\'t be longer than 255 characters').trim(),
});
export type LoginSchema = typeof loginSchema;

export const emailFormSchema = z.object({
   email: z.string().min(3).max(255).email().trim().toLowerCase(),
   emailConfirm: z.string().min(3).max(255).email().trim().toLowerCase(),
}).superRefine(({ email, emailConfirm}, context) =>{
   if(email !== emailConfirm) {
      context.addIssue({
         code: 'custom',
         message: 'Emails must match', 
         path: ['email']
      })
      context.addIssue({
         code: 'custom',
         message: 'Emails must match', 
         path: ['emailConfirm']
      })
   }
});
export type EmailFormSchema = typeof emailFormSchema;

export const addressFormSchema = z.object({
   organizationName: z.string().min(1).max(255).trim().optional(),
   address1: z.string().min(2).max(255).trim(),
   address2: z.string().min(2).max(255).trim().optional(),
   city: z.string(),
   state: z.string().min(2).max(255),
   zip: z.string(),
   country: z.string().min(2).max(2),
   phoneNum1: z.string().min(10).max(12).trim(),
   phoneNum1Country: z.string().min(2).max(2).trim(),
   phoneNum2: z.string().min(10).max(12).trim().optional(),
   phoneNum2Country: z.string().min(2).max(2).trim().optional(),
});
export type AddressFormSchema = typeof addressFormSchema;

export const nameFormSchema = z.object({
   familyName: z.string().min(1).max(255).trim(),
   givenName: z.string().min(1).max(255).trim(),
});
export type NameFormSchema = typeof nameFormSchema;


export const registerFormSchema = z.object({
   email: z.string().min(5).max(255), 
   password: z.string().min(6, 'Password must be at least 6 characters')
      .max(255,'Password can\'t be longer than 255 characters'),
   passwordConfirm: z.string().min(6, 'Password must be at least 6 characters')
      .max(255,'Password can\'t be longer than 255 characters'),
}).superRefine(({password, passwordConfirm}, context)=>{
   if(passwordConfirm !== password){
      context.addIssue({
         code: 'custom',
         message: 'Password must match confirm password', 
         path: ['password']
      })
      context.addIssue({
         code: 'custom',
         message: 'Password must match confirm password', 
         path: ['confirmPassword']
      })
   }
});
export type RegisterFormSchema = typeof registerFormSchema;