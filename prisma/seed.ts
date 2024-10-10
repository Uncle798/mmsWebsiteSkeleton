import {  PrismaClient, User, PaymentType, Unit, ContactInfo, Lease } from '@prisma/client';
import { faker } from '@faker-js/faker';
import dayjs  from 'dayjs';
import { hash } from '@node-rs/argon2';
import  unitData from './unitData'
import pricingData  from './pricingData'
import sizeDescription  from './sizeDescription'
import { PartialContactInfo, PartialLease, PartialInvoice, PartialPaymentRecord } from '../src/lib/server/partialTypes'
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
   email: '',
   passwordHash: hashedPass,
   givenName: faker.person.firstName(),
   familyName: faker.person.lastName(),
   organizationName: '',
}));

async function deleteAll() {
   await prisma.paymentRecord.deleteMany().catch((err) =>{
      console.error(err);
   });
   await prisma.invoice.deleteMany().catch((err) =>{
      console.error(err);
   });
   await prisma.lease.deleteMany().catch((err) =>{
      console.error(err);
   });
   await prisma.unit.deleteMany().catch((err) =>{
      console.error(err);
   });
   await prisma.contactInfo.deleteMany().catch((err) =>{
      console.error(err);
   });
   await prisma.passwordReset.deleteMany().catch((err) =>{
      console.error(err);
   });
   await prisma.verification.deleteMany().catch((err) =>{
      console.error(err);
   });
   await prisma.session.deleteMany().catch((err) =>{
      console.error(err);
   });
   await prisma.user.deleteMany().catch((err) =>{
      console.error(err);
   });
   return true;
 }
 
 async function countAll() {
   let count = 0;
   count += await prisma.paymentRecord.count();
   count += await prisma.invoice.count();
   count += await prisma.lease.count();
   count += await prisma.paymentRecord.count();
   count += await prisma.unit.count();
   count += await prisma.contactInfo.count();
   count += await prisma.user.count();
   return count;
 }

 function userMakeEmail() {
   for(let i = 0; i < userData.length; i++){
      const randString: string = String(Math.floor(Math.random() * 101));
      const emailFront = userData[i].givenName + '.' + userData[i].familyName + randString;
      if (i % 7 === 0) {
         userData[i].email = emailFront.toLowerCase() + '@veryFakeEmail.com'.toLowerCase();
         userData[i].organizationName = faker.company.name();
      } else if (i % 7 === 1) {
         userData[i].email = emailFront.toLowerCase() + '@sillyNotRealEmail.com'.toLowerCase();
      } else if (i % 7 === 2) {
         // cSpell:disable 
         userData[i].email = emailFront.toLowerCase() + '@blahblahblahEmail.com'.toLowerCase();
      } else if (i % 7 === 3) {
         userData[i].email = emailFront.toLowerCase() + '@horribleEmailAddress.com'.toLowerCase();
      } else if (i % 7 === 4) {
         userData[i].email = emailFront.toLowerCase() + '@emailemailemail.com';
      } else if (i % 7 === 5) {
         userData[i].email = emailFront.toLowerCase() + '@dumbfancyemail.com';
      } else if (i % 7 === 6) {
         userData[i].email = emailFront.toLowerCase() + '@sweetsweetemail.com';
      }
   }
   userData.forEach((user) =>{
      const sameEmail = userData.filter((u) => u.email === user.email);
      if(sameEmail.length > 1){
         const randString:string=String(Math.floor(Math.random()*101));
         const emailFront = user.givenName + '.' + user.familyName + randString;
         user.email = emailFront.toLowerCase() + 'yetanotherfakeemail.com';
         //cSpell:enable
      }
   })
}

async function createEmployees() {
   const employees: User[] = [];
   const employeePass = await hash(process.env.EMPLOYEE_PASSWORD!, {
      memoryCost: 19456,
      timeCost: 2,
      outputLen: 32,
      parallelism: 1
   })
   employees.push(await prisma.user.create({
      data:{
         email: 'email@email.email',
         emailVerified: true,
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
            emailVerified: true,
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
            emailVerified: true,
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

// async function randomEmployee() {
//    const employees = await prisma.user.findMany({
//       where:{
//          employee: true
//       },
//       select: { id: true }
//    });
//    const employee = employees[Math.floor(Math.random() * employees.length)];
//    return employee;
// }
function arrayOfMonths(startDate:Date, endDate:Date){
   const dateArray:Date[]=[];
   let currentDate = startDate;
   const numberOfMonths = dayjs(endDate).diff(startDate, 'months');
   for(let i=0; i<numberOfMonths; i++){
      dateArray.push(new Date(currentDate));
      currentDate = new Date(currentDate.setMonth(currentDate.getMonth()+1));
   }
   return dateArray;
}

async function createLease(unit: Unit, leaseStart, leaseEnd: Date | null, randEmployee: User, customer: User, contact:ContactInfo) {
   const leaseEnded:Date | null = leaseEnd;
   const lease:PartialLease = {
       customerId: customer!.id,
       employeeId: randEmployee.id,
       contactInfoId: contact.contactId,
       unitNum: unit.num,
       price: unit.advertisedPrice,
       leaseEffectiveDate: new Date(leaseStart),
       leaseReturnedAt: new Date(leaseStart),
       leaseEnded,
   };
   return lease;
 }

 function makeContactInfo(users:User[]){
   const contactInfos:PartialContactInfo[]=[]
   users.forEach((user, i) =>{
      const contactInfo:PartialContactInfo = {
         userId: user.id,
         address1: faker.location.streetAddress(), 
         city: faker.location.city(),
         state: faker.location.state({abbreviated: true}),
         zip: faker.location.zipCode(),
         phoneNum1: faker.phone.number(),
      }
      contactInfos.push(contactInfo);
      if(i%12 === 0 ) {
         const contactInfo2:PartialContactInfo = {
            userId: user.id,
            address1: faker.location.streetAddress(), 
            city: faker.location.city(),
            state: faker.location.state({abbreviated: true}),
            zip: faker.location.zipCode(),
            phoneNum1: faker.phone.number(),
         }
         contactInfos.push(contactInfo2);

      }
   });
   return contactInfos;
 }

 function makeUnit(unit){
    const sD = sizeDescription.find((description) => description.size === unit.size);
    const price = pricingData.find((p) => p.size === unit.size);
    const newUnit:Unit= {} as Unit;
      newUnit.building=unit.building;
      newUnit.num = unit.num;
      newUnit.size = unit.size;
      newUnit.leasedPrice = price?.price || 0;
      newUnit.advertisedPrice = price?.price || 0;
      newUnit.deposit = price?.price || 5;

      newUnit.description = sD?.description ? sD.description : '';
   return newUnit
 }


function makeInvoice(lease:Lease, month:Date){
   let invoicePaid:Date | null = dayjs(month).add(1, 'month').toDate();
   if(dayjs(new Date).diff(invoicePaid, 'days') < 30 ) {
      invoicePaid = null;
   }
   const invoice:PartialInvoice = {
      customerId: lease.customerId,
      leaseId: lease.leaseId,
      invoiceAmount: lease.price,
      invoiceCreated: month,
      invoiceNotes: `Rent for ${lease.unitNum.replace(/^0+/gm,'')} ${month.getDate()}/${month.getMonth()+1}/${month.getFullYear()}`,
      invoicePaid
   };
   return invoice;
}

async function  main (){
   const deleteStartTime = dayjs(new Date);
   await deleteAll();
   const deleteEndTime = dayjs(new Date);
   console.log(`📋 Previous records deleted in ${deleteEndTime.diff(deleteStartTime, 's')} sec`);
   userMakeEmail();
   const users:User[] = await prisma.user.createManyAndReturn({
      data: userData
   });
   const contactInfos = makeContactInfo(users);
   const dbContacts = await prisma.contactInfo.createManyAndReturn({
      data: contactInfos
   })
   await createEmployees();
   const totalUsers = await prisma.user.count();
   const userEndTime = dayjs(new Date);
   console.log(`👥 ${totalUsers} users created in ${userEndTime.diff(deleteEndTime, 's')} sec`);
   const uD:Unit[]=[];
   unitData.forEach((unit)=>{
      const dbUnit = makeUnit(unit);
      uD.push(dbUnit);
   })
   const units = await prisma.unit.createManyAndReturn({
      data: uD
   })
   const unitEndTime = dayjs(new Date);
   console.log(`🚪 ${units.length} units created in ${unitEndTime.diff(userEndTime, 'ms')} ms`);
   const leases:PartialLease[]=[];
   let leaseStart = dayjs(earliestStarting);
   const today = dayjs();
   let numMonthsLeft = today.diff(leaseStart, 'months');
   const employees = await prisma.user.findMany({
      where:{
         employee: true
      }
   })
   let lengthOfLease = Math.floor(Math.random()*numMonthsLeft);
   for await (const unit of units) {
      const randEmployee = employees[Math.floor(Math.random()*employees.length)];
      let leaseEnd = leaseStart.add(lengthOfLease, 'months');
      let customer = users.pop();
      let contact = dbContacts.find((c) => c.userId === customer!.id);
         while (numMonthsLeft > 3) {
            const lease = await createLease(unit, 
               leaseStart.toDate(), 
               leaseEnd.toDate(), 
               randEmployee, 
               customer!,
               contact!
            );
            leases.push(lease);
            leaseStart = leaseEnd.add(1,'months');
            numMonthsLeft = today.diff(leaseStart, 'months');
            lengthOfLease = Math.floor(Math.random()*numMonthsLeft);
            if(lengthOfLease > 78){
               lengthOfLease = 1
            }
            leaseEnd = leaseStart.add(lengthOfLease, 'months');
            customer = users.pop();
            contact = dbContacts.find((c) => c.userId === customer!.id);
         };
         leaseStart = dayjs(earliestStarting);
         numMonthsLeft = today.diff(leaseStart);
      }
   }
   for (const lease of leases){
      const leaseEnd = dayjs(lease.leaseEnded);
      if(today.diff(leaseEnd, 'months') <3){
         lease.leaseEnded = null;
      }
   }
   const dbLeases = await prisma.lease.createManyAndReturn({
      data: leases
   })
   const leaseEndTime = dayjs(new Date);
   console.log(`🎫 ${leases.length} leases created in ${leaseEndTime.diff(unitEndTime, 'ms')} ms`);
   const invoices: PartialInvoice[] = [];
   for await (const lease of dbLeases){
      const leaseEndDate:Date | null = lease.leaseEnded ?? new Date;
      const months:Date[] = arrayOfMonths(lease.leaseEffectiveDate, leaseEndDate); 
      for await (const month of months) {
         const invoice = makeInvoice(lease, month)
         invoices.push(invoice)
      }
   }
   const dbInvoices = await prisma.invoice.createManyAndReturn({
      data: invoices,
   })
   const invoiceEndTime = dayjs(new Date);
   console.log(`💰 ${invoices.length} invoices created in ${invoiceEndTime.diff(leaseEndTime, 'ms')} ms`);
   const paymentRecords:PartialPaymentRecord[]=[];
   for await (const invoice of dbInvoices){

      const paymentDate = dayjs(invoice.invoiceCreated).add(1, 'months');
      if(dayjs(today).diff(paymentDate, 'days') < 30) {
         continue;
      }
      const employee = employees[Math.floor(Math.random()*employees.length)];
      const randNum = Math.floor(Math.random()*3);
      const paymentType = PaymentType[Object.keys(PaymentType)[randNum]];
      const record = {
            paymentType: paymentType,
            customerId: invoice!.customerId!,
            paymentAmount: invoice.invoiceAmount, 
            receiverId: employee.id,
            paymentCreated: paymentDate.toDate(),         
            paymentCompleted: paymentDate.toDate(), 
            invoiceId: invoice.invoiceId
         }      
      paymentRecords.push(record);
   }                              
   await prisma.paymentRecord.createMany({
      data: paymentRecords
   })                       
   const paymentEndTime = dayjs(new Date);
   const totalRecords = await countAll();
   console.log(`🧾 ${paymentRecords.length} payment records created in ${paymentEndTime.diff(invoiceEndTime, 'ms')} ms`);
   console.log(`🖥️  ${totalRecords} database entries created in ${paymentEndTime.diff(deleteStartTime, 'second')} sec`);
}


main().catch((error)=>{
   console.log(error);
   process.exit(1);
})
.finally(()=>{
   prisma.$disconnect();
});