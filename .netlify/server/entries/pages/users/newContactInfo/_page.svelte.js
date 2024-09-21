import { c as create_ssr_component, e as escape, v as validate_component, d as each } from "../../../../chunks/ssr.js";
import { P as PUBLIC_COMPANY_NAME } from "../../../../chunks/public.js";
import { A as Address } from "../../../../chunks/Address.js";
import { N as NameBlock } from "../../../../chunks/NameBlock.js";
const Page = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  let { data } = $$props;
  const dbUser = data.dbUser;
  const contactInfos = data.contactInfos;
  if ($$props.data === void 0 && $$bindings.data && data !== void 0) $$bindings.data(data);
  if ($$props.dbUser === void 0 && $$bindings.dbUser && dbUser !== void 0) $$bindings.dbUser(dbUser);
  if ($$props.contactInfos === void 0 && $$bindings.contactInfos && contactInfos !== void 0) $$bindings.contactInfos(contactInfos);
  return `${$$result.head += `<!-- HEAD_svelte-qmeths_START -->${$$result.title = `<title>${escape(PUBLIC_COMPANY_NAME)} | Home</title>`, ""}<!-- HEAD_svelte-qmeths_END -->`, ""} ${validate_component(NameBlock, "NameBlock").$$render($$result, { nameBlock: dbUser }, {}, {})} ${each(contactInfos, (info) => {
    return `${validate_component(Address, "Address").$$render($$result, { address: info }, {}, {})}`;
  })}`;
});
export {
  Page as default
};
