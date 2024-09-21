import { p as prisma } from "../../../../chunks/prisma.js";
import { z } from "zod";
import "../../../../chunks/client.js";
import "../../../../chunks/formData.js";
import "../../../../chunks/index.js";
import { s as superValidate, z as zod } from "../../../../chunks/zod.js";
import "../../../../chunks/memoize.js";
const availableUnitsSchema = z.object({
  unitPriceId: z.string()
});
const load = async () => {
  const form = await superValidate(zod(availableUnitsSchema));
  const unitPricing = await prisma.unitPricing.findMany({
    orderBy: {
      unitNum: "asc"
    }
  });
  const units = await prisma.unit.findMany({
    orderBy: {
      num: "asc"
    }
  });
  const leases = await prisma.lease.findMany({
    where: {
      leaseEnded: null
    },
    orderBy: {
      unitNum: "asc"
    }
  });
  const availableUnits = [];
  unitPricing.forEach((unitPrice) => {
    const unitLease = leases.find((lease) => lease.unitNum === unitPrice.unitNum);
    const unitInfo = units.find((u) => u.num === unitPrice.unitNum);
    if (!unitLease) {
      const availableUnit = { ...unitInfo, ...unitPrice };
      availableUnits.push(availableUnit);
    }
  });
  return { form, availableUnits };
};
const actions = {};
export {
  actions,
  load
};
