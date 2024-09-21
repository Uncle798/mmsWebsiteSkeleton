import { c as create_ssr_component, e as escape } from "../../../../../chunks/ssr.js";
import { P as PUBLIC_COMPANY_NAME } from "../../../../../chunks/public.js";
import "@stripe/stripe-js";
import "../../../../../chunks/client.js";
const Page = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  let { data } = $$props;
  if ($$props.data === void 0 && $$bindings.data && data !== void 0) $$bindings.data(data);
  let $$settled;
  let $$rendered;
  let previous_head = $$result.head;
  do {
    $$settled = true;
    $$result.head = previous_head;
    $$rendered = `${$$result.head += `<!-- HEAD_svelte-9m24rc_START -->${$$result.title = `<title>${escape(PUBLIC_COMPANY_NAME)} | Please pay your deposit</title>`, ""}<!-- HEAD_svelte-9m24rc_END -->`, ""} ${`loading...`}`;
  } while (!$$settled);
  return $$rendered;
});
export {
  Page as default
};
