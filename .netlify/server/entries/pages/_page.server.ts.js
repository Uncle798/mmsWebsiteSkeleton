import "../../chunks/prisma.js";
import "../../chunks/index.js";
const load = async ({ locals }) => {
  const { user } = locals;
  return { user };
};
export {
  load
};
