import { p as prisma } from "../../../chunks/prisma.js";
import { r as redirect, f as fail } from "../../../chunks/index.js";
import "../../../chunks/client.js";
import "../../../chunks/formData.js";
import { s as superValidate, z as zod } from "../../../chunks/zod.js";
import "../../../chunks/memoize.js";
import { z } from "zod";
import { h as handleLoginRedirect } from "../../../chunks/utils.js";
const customerSchema = z.object({
  customerId: z.string().min(23).max(30)
});
const load = async (event) => {
  if (!event.locals.user) {
    throw redirect(302, handleLoginRedirect(event));
  }
  const form = await superValidate(zod(customerSchema));
  const leases = await prisma.lease.findMany({
    where: {
      leaseEnded: null
    },
    orderBy: {
      unitNum: "asc"
    }
  });
  const users = await prisma.user.findMany({
    where: {
      customerLeases: {
        some: {
          leaseEnded: null
        }
      }
    }
  });
  const tableData = [];
  leases.forEach((lease) => {
    const user = users.find((u) => u.id === lease.customerId);
    if (user) {
      const datum = { ...lease, ...user };
      tableData.push(datum);
    }
  });
  return { tableData, form };
};
const actions = {
  default: async (event) => {
    const form = await superValidate(event.request, zod(customerSchema));
    if (!form.valid) {
      return fail(400, { form });
    }
    console.log(form.data);
  }
};
export {
  actions,
  load
};
