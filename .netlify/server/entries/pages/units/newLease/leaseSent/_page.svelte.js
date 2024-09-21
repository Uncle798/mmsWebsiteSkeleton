import { c as create_ssr_component, e as escape } from "../../../../../chunks/ssr.js";
import { P as PUBLIC_COMPANY_NAME, a as PUBLIC_ANVIL_EMAIL } from "../../../../../chunks/public.js";
const Page = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  let { data } = $$props;
  if ($$props.data === void 0 && $$bindings.data && data !== void 0) $$bindings.data(data);
  return `${$$result.head += `<!-- HEAD_svelte-pijhpq_START -->${$$result.title = `<title>${escape(PUBLIC_COMPANY_NAME)} | Lease Sent!</title>`, ""}<!-- HEAD_svelte-pijhpq_END -->`, ""} <h1 class="h1" data-svelte-h="svelte-1qte7i5">Lease Sent!</h1> <h3 class="h3">Please check ${escape(data.user?.email)} for an email from ${escape(PUBLIC_ANVIL_EMAIL)} and sign the attached lease</h3> <p class="p">Leases are signed after both you and a representative of ${escape(PUBLIC_COMPANY_NAME)} have signed it. ${escape(PUBLIC_COMPANY_NAME)} will sign contracts 
   during business hours, and you&#39;ll be notified and sent a copy of the finalized contract. ${escape(PUBLIC_COMPANY_NAME)} does not provide locks,
   you must provide your own.</p>`;
});
export {
  Page as default
};
