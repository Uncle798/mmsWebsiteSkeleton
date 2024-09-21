const load = async ({ locals }) => {
  const { user } = await locals;
  return { user };
};
export {
  load
};
