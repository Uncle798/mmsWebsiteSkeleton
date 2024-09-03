import { Lease, PrismaClient, User, Invoice, UnitPricing, PaymentType, PaymentRecord, Unit, } from '@prisma/client';
import { faker } from '@faker-js/faker';
import dayjs  from 'dayjs';
import { hash } from '@node-rs/argon2';
import  unitData from './unitData'
import pricingData  from './pricingData'
import sizeDescription  from './sizeDescription'
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
   await prisma.paymentRecord.deleteMany().catch((err) =>{
      console.error(err);
   });
   await prisma.unitPricing.deleteMany().catch((err) =>{
      console.error(err);
   });
   await prisma.pricing.deleteMany().catch((err) =>{
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
   count += await prisma.unitPricing.count();
   count += await prisma.pricing.count();
   count += await prisma.unit.count();
   count += await prisma.contactInfo.count();
   count += await prisma.user.count();
   return count;
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

async function randomEmployee() {
   const employees = await prisma.user.findMany({
      where:{
         employee: true
      },
      select: { id: true }
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
            { id:{notIn:employeeList} }
         ]
      },
   });
   const contactInfos = await prisma.contactInfo.findFirst({
      where: {
         userId: customer?.id
      }
   })
   const leaseEnded:Date | null = leaseEnd;
   const lease = await prisma.lease.create({
     data: {
       customerId: customer!.id,
       employeeId: randEmployee.id,
       contactInfoId: contactInfos!.contactId,
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
   const deleteStartTime = dayjs(new Date);
   await deleteAll();
   const deleteEndTime = dayjs(new Date);
   console.log(`📋 Previous records deleted in ${deleteEndTime.diff(deleteStartTime, 'ms')} ms`);
   userData.forEach((user, i)=>{
      if(i%7 === 0){
         user.email= user.givenName + '.' + user.familyName + '@veryFakeEmail.com'
         user.organizationName = faker.company.name()
      } else if (i%7 === 1){
         user.email= user.givenName + '.' + user.familyName + '@sillyNotRealEmail.com'
      } else if (i%7 === 2){
         user.email= user.givenName + '.' + user.familyName + '@blahblahblahEmail.com'
      } else if (i%7 === 3){
         user.email = user.givenName+ '.' + user.familyName + '@horribleEmailAddress.com'
      } else if (i%7 === 4){
         user.email = user.givenName+ '.' + user.familyName + '@emailemailemail.com'
      } else if (i%7 === 5){
         user.email = user.givenName+ '.' + user.familyName + '@dumbfancyemail.com'
         
      } else if (i%7 === 6){
         user.email = user.givenName+ '.' + user.familyName + '@sweetsweetemail.com'
      }
   })
   const users:User[] = await prisma.user.createManyAndReturn({
      data: userData
   })
   for await (const user of users) {
      await prisma.contactInfo.create({
         data:{
            userId: user.id!,
            address1: faker.location.streetAddress(), 
            city: faker.location.city(),
            state: faker.location.state({abbreviated: true}),
            zip: faker.location.zipCode(),
            phoneNum1: faker.phone.number(),
         }
      }) 
   }
   for(let i=0; i<users.length; i++){
      if(i%12 === 0){
         await prisma.contactInfo.create({
            data:{
               userId: users[i].id!,
               address1: faker.location.streetAddress(), 
               city: faker.location.city(),
               state: faker.location.state({abbreviated: true}),
               zip: faker.location.zipCode(),
               phoneNum1: faker.phone.number(),
            }
         }) 
         
      }
   }
   await createEmployees();
   const totalUsers = await prisma.user.count();
   const userEndTime = dayjs(new Date);
   console.log(`👥 ${totalUsers} users created in ${userEndTime.diff(deleteEndTime, 'ms')} ms`);
   const pricing = await prisma.pricing.createManyAndReturn({
      data: pricingData
   })
   const uD:Unit[]=[];
   unitData.forEach((unit)=>{
      const sD = sizeDescription.find((description) => description.size === unit.size);
      const newUnit:Unit= {} as Unit;
      newUnit.building=unit.building;
      newUnit.num = unit.num;
      newUnit.size = unit.size
      newUnit.description = sD?.description ? sD.description : '';
      uD.push(newUnit);
   })
   const units = await prisma.unit.createManyAndReturn({
      data: uD
   })
   for await (const unit of units) {
      const price = pricing.find((p) => p.size === unit.size);
      await prisma.unitPricing.create({
         data:{
            unitNum: unit.num,
            price: price!.price,
            startDate: new Date
         }
      });
   }
   const unitEndTime = dayjs(new Date);
   console.log(`🚪 ${units.length} units created in ${unitEndTime.diff(userEndTime, 'ms')} ms`);
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
   const employeeList = employees.map((employee) => employee.id);
   let lengthOfLease = Math.floor(Math.random()*numMonthsLeft);
   for await (const unit of pricedUnits) {
      const randEmployee = employees[Math.floor(Math.random()*employees.length)];
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
   const leaseEndTime = dayjs(new Date);
   console.log(`🎫 ${leases.length} leases created in ${leaseEndTime.diff(unitEndTime, 'ms')} ms`);
   const invoices: Invoice[] = [];
   for await (const lease of leases){
      const leaseEndDate:Date | null = lease.leaseEnded ?? new Date;
      const numMonths = dayjs(leaseEndDate).diff(lease.leaseEffectiveDate, 'months');
      const months:Date[] = Array.from({length:numMonths})
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
   const invoiceEndTime = dayjs(new Date);
   console.log(`💰 ${invoices.length} invoices created in ${invoiceEndTime.diff(leaseEndTime, 'ms')} ms`);
   const paymentRecords:PaymentRecord[]=[];
   for await (const invoice of invoices){
      const paymentDate = dayjs(invoice.invoiceCreated).add(1, 'months');
      const employee = await randomEmployee();
      const randNum = Math.floor(Math.random()*Object.keys(employees).length);
      const paymentType = PaymentType[Object.keys(PaymentType)[randNum]];
      const record = await prisma.paymentRecord.create({
         data:{
            paymentType: paymentType,
            customerId: invoice!.customerId!,
            unitNum: invoice.unitNum,
            unitPrice: invoice.amount, 
            amount: invoice.amount, 
            receiverId: employee.id,
            paymentCreated: paymentDate.toDate(),         
            paymentCompleted: paymentDate.toDate(), 
            recordNum: faker.string.uuid(),
            invoiceNum: invoice.invoiceId
         }      
      });
      paymentRecords.push(record);
   }                                                     
   const paymentEndTime = dayjs(new Date);
   const totalRecords = await countAll();
   console.log(`🧾 ${paymentRecords.length} payment records created in ${paymentEndTime.diff(invoiceEndTime, 'ms')} ms`);
   console.log(`🖥️  ${totalRecords} database entries created in ${paymentEndTime.diff(deleteStartTime, 'seconds')} seconds`);
}

main().catch((error)=>{
   console.log(error);
   process.exit(1);
})
.finally(()=>{
   prisma.$disconnect();
});