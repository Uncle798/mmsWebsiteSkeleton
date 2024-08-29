import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient({
   log: [
     {
       emit: "event",
       level: "query",
     },
   ],
 });

 async function deleteEric() {
   const user = await prisma.user.findUnique({
      where: {
         email: 'eric.branson@gmail.com'
      }
   })
   await prisma.paymentRecord.deleteMany({
      where: {
         customerId: user?.id
      }
   })
   await prisma.invoice.deleteMany({
      where: {
         customerId: user?.id
      }
   })
   await prisma.paymentRecord.deleteMany({
      where: {
         customerId: user?.id
      }
   })
   await prisma.lease.deleteMany({
      where: {
         customerId: user?.id
      }
   })
   await prisma.passwordReset.deleteMany({
      where: {
         userId: user?.id
      }
   })
   await prisma.verification.deleteMany({
      where: {
         userId: user?.id
      }
   })
   await prisma.session.deleteMany({
      where: {
         userId: user?.id
      }
   })
   await prisma.contactInfo.deleteMany({
      where: {
         userId: user?.id
      }
   })
   await prisma.user.delete({
      where:{
         email: 'eric.branson@gmail.com'
      }
   })
 }

 deleteEric().catch((error)=>{
   console.log(error);
   process.exit(1);
})
.finally(()=>{
   prisma.$disconnect();
});