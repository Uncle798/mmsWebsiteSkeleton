import { p as prisma } from "../../../chunks/prisma.js";
import dayjs from "dayjs";
import { r as redirect } from "../../../chunks/index.js";
import { h as handleLoginRedirect } from "../../../chunks/utils.js";
const load = async (event) => {
  if (!event.locals.user) {
    throw redirect(302, handleLoginRedirect(event));
  }
  if (event.locals.user) {
    throw redirect(303, "/units/available");
  }
  if (event.locals.user.employee) {
    const leases = await prisma.lease.findMany({
      orderBy: {
        unitNum: "asc"
      }
    });
    const units = await prisma.unitPricing.findMany({
      where: {
        endDate: null
      }
    });
    const users = await prisma.user.findMany({});
    const tableData = [];
    const today = Date.now();
    units.forEach((unit) => {
      const datum = {};
      datum.unitNum = unit.unitNum;
      datum.price = unit.price;
      const unitLeases = leases.filter((lease) => lease.unitNum === unit.unitNum);
      let shortestMonthsSinceLeaseEnded = 0;
      let monthsSinceLeaseEnded = 0;
      if (unitLeases) {
        for (let i = 0; i < unitLeases.length; i++) {
          const leaseEndDate = unitLeases[i].leaseEnded;
          if (!leaseEndDate) {
            datum.familyName = users.find((user) => user.id === unitLeases[i].customerId)?.familyName;
            datum.givenName = users.find((user) => user.id === unitLeases[i].customerId)?.givenName;
            datum.organizationName = users.find((user) => user.id === unitLeases[i].customerId)?.organizationName;
            datum.leasedFor = dayjs(today).diff(unitLeases[0].leaseEffectiveDate, "months");
            datum.emptyFor = 0;
            break;
          } else {
            monthsSinceLeaseEnded = dayjs(today).diff(leaseEndDate, "months");
          }
          if (shortestMonthsSinceLeaseEnded === 0) {
            shortestMonthsSinceLeaseEnded = monthsSinceLeaseEnded;
          } else if (monthsSinceLeaseEnded < shortestMonthsSinceLeaseEnded) {
            shortestMonthsSinceLeaseEnded = monthsSinceLeaseEnded;
          }
          datum.emptyFor = shortestMonthsSinceLeaseEnded;
        }
        tableData.push(datum);
      }
    });
    return {
      tableData
    };
  }
};
export {
  load
};
