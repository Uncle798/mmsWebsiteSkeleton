import { c as create_ssr_component, e as escape } from "../../../../chunks/ssr.js";
import { P as PUBLIC_COMPANY_NAME } from "../../../../chunks/public.js";
const Page = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  let { data } = $$props;
  if ($$props.data === void 0 && $$bindings.data && data !== void 0) $$bindings.data(data);
  return `${$$result.head += `<!-- HEAD_svelte-11f5w7h_START -->${$$result.title = `<title>${escape(PUBLIC_COMPANY_NAME)} | Unit: ${escape(data.unit.num.replace(/^0+/gm, "") ?? "")}</title>`, ""}<!-- HEAD_svelte-11f5w7h_END -->`, ""} <h1>Unit: ${escape(data.unit.num.replace(/^0+/gm, ""))}</h1> <h2>Size: ${escape(data.unit.size)}</h2> <h2>Advertised price: $${escape(data.unitPrice?.price)}</h2> <h3>Building: ${escape(data.unit.building)}</h3>`;
});
export {
  Page as default
};
