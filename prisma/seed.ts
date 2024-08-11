import { Lease, PrismaClient, User, Invoice, UnitPricing, PaymentType, PaymentRecord, Employee } from '@prisma/client';
import { faker } from '@faker-js/faker';
import dayjs  from 'dayjs';
import { hash } from '@node-rs/argon2';

import  unitData from './unitData'
import pricingData  from './pricingData'

const numUsers=unitData.length + 1500;
const earliestStarting = new Date('2018-01-01');
const hashedPass = await hash(String(process.env.USER_PASSWORD), {
   memoryCost: 19456,
   timeCost: 2,
   outputLen: 32,
   parallelism: 1
})

const prisma = new PrismaClient({
   log: [
     {
       emit: "event",
       level: "query",
     },
   ],
 });
 
// prisma.$on('query', e => {
//           console.log('Query: ' + e.query);
//           console.log('Params: ' + e.params);
//           console.log('Duration: ' + e.duration + 'ms');
//         });

const userData = Array.from({length:numUsers}).map(()=>({
   email: faker.internet.email(),
   passwordHash: hashedPass,
   givenName: faker.person.firstName(),
   familyName: faker.person.lastName()
}));

async function deleteAll() {
   await prisma.paymentRecord.deleteMany();
   await prisma.invoice.deleteMany();
   await prisma.lease.deleteMany();
   await prisma.paymentRecord.deleteMany();
   await prisma.unitPricing.deleteMany();
   await prisma.pricing.deleteMany();
   await prisma.unit.deleteMany();
   await prisma.contactInfo.deleteMany();
   await prisma.user.deleteMany();
   return true;
 }
 
//  async function countAll() {
//    let count = 0;
//    count += await prisma.paymentRecord.count();
//    count += await prisma.invoice.count();
//    count += await prisma.lease.count();
//    count += await prisma.paymentRecord.count();
//    count += await prisma.unitPricing.count();
//    count += await prisma.pricing.count();
//    count += await prisma.unit.count();
//    count += await prisma.contactInfo.count();
//    count += await prisma.user.count();
//    return count;
//  }

async function createEmployees() {
   const employees: User[] = [];
   const employeePass = await hash(process.env.EMPLOYEE_PASSWORD, {
      memoryCost: 19456,
      timeCost: 2,
      outputLen: 32,
      parallelism: 1
   })
   employees.push(await prisma.user.create({
      data:{
         email: String(process.env.MY_EMAIL),
         emailVerified: new Date,
         passwordHash: employeePass,
         givenName: 'Eric',
         familyName: 'Branson',
         contactInfo:{
            create:{
               address1: faker.location.streetAddress(), 
               city: faker.location.city(),
               state: faker.location.state({abbreviated: true}),
               zip: faker.location.zipCode(),
               phoneNum1: faker.phone.number(),
            }
         },
         employee: true,
         admin: true
      }
   }))
   employees.push(
      await prisma.user.create({
         data:{
            email: String(process.env.GEORGE_EMAIL),
            passwordHash: employeePass,
            emailVerified: new Date,
            givenName: 'George',
            familyName: 'Branson',
            contactInfo:{
               create:{
                  address1: faker.location.streetAddress(), 
                  city: faker.location.city(),
                  state: faker.location.state({abbreviated: true}),
                  zip: faker.location.zipCode(),
                  phoneNum1: faker.phone.number(),
               }
            },
            employee: true,
            admin: true
         }
      })
   )
   employees.push(
      await prisma.user.create({
         data:{
            email: String(process.env.EMPLOYEE_EMAIL),
            passwordHash: employeePass,
            emailVerified: new Date,
            givenName: 'Walter',
            familyName: 'Branson',
            contactInfo:{
               create:{
                  address1: faker.location.streetAddress(), 
                  city: faker.location.city(),
                  state: faker.location.state({abbreviated: true}),
                  zip: faker.location.zipCode(),
                  phoneNum1: faker.phone.number(),
               }
            },
            employee: true,
            admin: false
         }
      })
   )
   return employees
}

async function randomEmployee() {
   const employees = await prisma.user.findMany({
      select: { userId: true }
   });
   const employee = employees[Math.floor(Math.random() * employees.length)];
   return employee;
}


async function createLease(unit: UnitPricing, leaseStart, leaseEnd: Date | null, employeeList: string[], randEmployee: User) {
   const customer = await prisma.user.findFirst({
      where: {
         AND:[
            {customerLeases: {
               none: {}
            }},
            { userId:{notIn:employeeList} }
         ]
      },
   });
   const contactInfos = await prisma.contactInfo.findFirst({
      where: {
         email: customer?.email
      }
   })
   const leaseEnded:Date | null = leaseEnd;
   const lease = await prisma.lease.create({
     data: {
       customerId: customer!.userId,
       employeeId: randEmployee.userId,
       contactInfoId: contactInfos?.contactId,
       unitNum: unit.unitNum,
       price: unit.price,
       leaseEffectiveDate: new Date(leaseStart),
       leaseReturnedAt: new Date(leaseStart),
       leaseEnded,
     },
   });
   return lease;
 }

async function  main (){
   await deleteAll();
   const pricing = await prisma.pricing.createManyAndReturn({
      data: pricingData
   })
   const units = await prisma.unit.createManyAndReturn({
      data: unitData
   })
   for await (const unit of units) {
      const price = pricing.find((p) => p.size === unit.size);
      await prisma.unitPricing.create({
         data:{
            unitNum: unit.num,
            price: price.price,
            startDate: new Date
         }
      });
   }
   const users = await prisma.user.createManyAndReturn({
      data: userData
   }).catch((error)=>{
      console.error(error);
   });
   for await (const user of users) {
      
      await prisma.contactInfo.create({
         data:{
            email: user.email,
            address1: faker.location.streetAddress(), 
            city: faker.location.city(),
            state: faker.location.state({abbreviated: true}),
            zip: faker.location.zipCode(),
            phoneNum1: faker.phone.number(),
            organizationName: faker.company.name()
         }
      }) 
   }
   await createEmployees();
   const pricedUnits = (await prisma.unitPricing.findMany());
   const leases:Lease[]=[];
   let leaseStart = dayjs(earliestStarting);
   const today = dayjs();
   let numMonthsLeft = today.diff(leaseStart, 'months');
   const employees = await prisma.user.findMany({
       where:{
         employee: true
      }
   })
   const employeeList = employees.map((employee) => employee.userId);
   const randEmployee = employees[Math.floor(Math.random()*employees.length)];
   let lengthOfLease = Math.floor(Math.random()*numMonthsLeft);
   for await (const unit of pricedUnits) {
      let leaseEnd = leaseStart.add(lengthOfLease, 'months');
      while (numMonthsLeft > 3) {
         const lease = await createLease(unit, 
            leaseStart.toDate(), 
            leaseEnd.toDate(),
            employeeList, 
            randEmployee);
            leases.push(lease);
            leaseStart = leaseEnd.add(1,'months');
            numMonthsLeft = today.diff(leaseStart, 'months');
            lengthOfLease = Math.floor(Math.random()*numMonthsLeft);
         if(lengthOfLease > 78){
            lengthOfLease = 1
         }
         leaseEnd = leaseStart.add(lengthOfLease, 'months');
      };
      // if(leaseEnd.toDate() > today.toDate()){ leaseEnd = NaN};
      leaseStart = dayjs(earliestStarting);
      numMonthsLeft = today.diff(leaseStart);
   }
   for await (const lease of leases){
      const leaseEnd = dayjs(lease.leaseEnded);
      if(today.diff(leaseEnd, 'months') <3){
         await prisma.lease.update({
            where:{
               leaseId: lease.leaseId
            },
            data:{
               leaseEnded: null
            }
         })
      }
   }
   const invoices: Invoice[] = [];
   for await (const lease of leases){
      const leaseEndDate:Date | null = lease.leaseEnded ?? new Date;
      const numMonths = dayjs(leaseEndDate).diff(lease.leaseEffectiveDate, 'months');
      const months = Array.from({length:numMonths})
      for await (const month of months) {
         const invoice = await prisma.invoice.create({
           data: {
             customerId: lease.customerId,
             leaseId: lease.leaseId,
             amount: lease.price,
             invoiceCreated: month,
             unitNum: lease.unitNum,
             price: lease.price,
           },
         });
   
         invoices.push(invoice)
      }
   }
   for await (const invoice of invoices){
      const paymentDate = dayjs(invoice.invoiceCreated).add(1, 'months');
      const employee = await randomEmployee();
      const randNum = Math.floor(Math.random()*Object.keys(employees).length);
      const paymentType = PaymentType[Object.keys(PaymentType)[randNum]];
      const record = await prisma.paymentRecord.create({
         data:{
            paymentType: paymentType,
            customerId: invoice.customerId,
            unitNum: invoice.unitNum,
            unitPrice: invoice.amount, 
            amount: invoice.amount, 
            receiverId: employee.userId,
            paymentCreated: paymentDate.toDate(),         
            paymentCompleted: paymentDate.toDate(), 
            recordNum: faker.string.uuid(),
            invoiceNum: invoice.invoiceId
         }
      });
   }                                                     
}

main().catch((error)=>{
   console.log(error);
   process.exit(1);
})
.finally(()=>{
   prisma.$disconnect();
});