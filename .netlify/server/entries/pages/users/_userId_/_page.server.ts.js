import { p as prisma } from "../../../../chunks/prisma.js";
import { r as redirect } from "../../../../chunks/index.js";
import { h as handleLoginRedirect } from "../../../../chunks/utils.js";
import "../../../../chunks/client.js";
import "../../../../chunks/formData.js";
import "../../../../chunks/memoize.js";
const load = async (event) => {
  if (!event.locals.user) {
    return redirect(302, handleLoginRedirect(event));
  }
  const userId = event.params.userId;
  if (event.locals.user.employee) {
    const dbUser = await prisma.user.findUnique({
      where: {
        id: userId
      }
    });
    const contactInfo = await prisma.contactInfo.findMany({
      where: {
        userId: dbUser?.id,
        softDelete: false
      }
    });
    const leases = await prisma.lease.findMany({
      where: {
        customerId: dbUser?.id
      }
    });
    const invoices = await prisma.invoice.findMany({
      where: {
        customerId: userId
      }
    });
    const payments = await prisma.paymentRecord.findMany({
      where: {
        customerId: dbUser?.id
      }
    });
    const tableData = [];
    invoices.forEach((invoice) => {
      const payment = payments.find((p) => p.paymentId === invoice.invoiceId);
      if (payment) {
        const datum = { ...invoice, ...dbUser, ...payment };
        datum.unitNum = invoice.unitNum || "";
        tableData.push(datum);
      }
    });
    return { dbUser, contactInfo, leases, tableData };
  }
  if (event.locals.user && !event.locals.user.employee) {
    if (event.locals.user.id !== userId) {
      redirect(302, handleLoginRedirect(event));
    }
  }
};
const actions = {
  default: async (event) => {
  }
};
export {
  actions,
  load
};
