import { p as prisma } from "../../../../chunks/prisma.js";
import "../../../../chunks/client.js";
import "../../../../chunks/formData.js";
import { r as redirect, e as error } from "../../../../chunks/index.js";
import { s as superValidate, z as zod, m as message } from "../../../../chunks/zod.js";
import z from "zod";
import "../../../../chunks/memoize.js";
import { r as ratelimit } from "../../../../chunks/redis.js";
const newLeaseSchema = z.object({
  contactInfoId: z.string().min(23).max(30),
  unitPriceId: z.string().min(23).max(30),
  unitNum: z.string().min(23).max(30),
  organization: z.boolean()
});
const load = async (event) => {
  if (!event.locals.user) {
    redirect(302, "/login");
  }
  const form = await superValidate(zod(newLeaseSchema));
  const newLease = event.url.searchParams.get("newLease");
  if (!event.locals.user.employee) {
    const unitNum = event.url.searchParams.get("unitNum");
    console.log(unitNum);
    if (!unitNum) {
      redirect(302, "/units/available?newLease=true");
    }
    let unit;
    if (unitNum) {
      unit = await prisma.unit.findFirst({
        where: {
          num: unitNum
        }
      }).catch((err) => {
        console.error(err);
        return error(404, "Unit not found");
      });
    } else {
      unit = null;
    }
    console.log(unit);
    const address = await prisma.contactInfo.findMany({
      where: {
        userId: event.locals.user.id
      }
    }).catch((err) => {
      console.error(err);
    });
    let unitPrice;
    if (unit) {
      unitPrice = await prisma.unitPricing.findFirst({
        where: {
          endDate: null,
          unitNum: unit.num
        }
      });
      return { form, unit, address, unitPrice, newLease };
    }
    return { form, address, unit, newLease };
  }
  return { form, newLease };
};
const actions = {
  default: async (event) => {
    const form = await superValidate(event.request, zod(newLeaseSchema));
    if (!form.valid) {
      message(form, "no good");
    }
    const { success, reset } = await ratelimit.register.limit(event.getClientAddress());
    if (!success) {
      const timeRemaining = Math.floor((reset - Date.now()) / 1e3);
      return message(form, `Please wait ${timeRemaining}s before trying again.`);
    }
    const customer = await prisma.user.findUniqueOrThrow({
      where: {
        id: event.locals.user?.id
      }
    }).catch((err) => {
      console.error(err);
    });
    const unit = await prisma.unit.findFirst({
      where: {
        num: form.data.unitNum
      }
    }).catch((err) => {
      console.error(err);
    });
    const currentLease = await prisma.lease.findFirst({
      where: {
        unitNum: unit?.num,
        leaseEnded: null
      }
    });
    if (currentLease) {
      message(form, "That unit is already leased");
    }
    const unitPrice = await prisma.unitPricing.findUniqueOrThrow({
      where: {
        unitPricingId: form.data.unitPriceId
      }
    }).catch((err) => {
      console.error(err);
    });
    const contactInfoId = form.data.contactInfoId;
    const employees = await prisma.user.findMany({
      where: {
        employee: true
      }
    });
    const employee = employees[Math.floor(Math.random() * employees.length)];
    const lease = await prisma.lease.create({
      data: {
        customerId: customer.id,
        employeeId: employee.id,
        unitNum: form.data.unitNum,
        price: unitPrice.price,
        contactInfoId,
        leaseEffectiveDate: /* @__PURE__ */ new Date()
      }
    });
    const invoice = await prisma.invoice.create({
      data: {
        price: lease.price,
        unitNum: lease.unitNum,
        invoiceAmount: lease.price,
        customerId: lease.customerId,
        leaseId: lease.leaseId,
        invoiceNotes: "Deposit for " + lease.unitNum
      }
    });
    redirect(302, "/units/newLease/payDeposit?invoiceId=" + invoice.invoiceId);
  }
};
export {
  actions,
  load
};
