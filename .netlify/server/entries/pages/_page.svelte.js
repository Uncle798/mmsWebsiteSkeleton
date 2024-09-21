import { c as create_ssr_component, e as escape } from "../../chunks/ssr.js";
import { P as PUBLIC_COMPANY_NAME } from "../../chunks/public.js";
const Page = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  let { data } = $$props;
  if ($$props.data === void 0 && $$bindings.data && data !== void 0) $$bindings.data(data);
  return `${$$result.head += `<!-- HEAD_svelte-qmeths_START -->${$$result.title = `<title>${escape(PUBLIC_COMPANY_NAME)} | Home</title>`, ""}<!-- HEAD_svelte-qmeths_END -->`, ""} <h1>${escape(PUBLIC_COMPANY_NAME)}</h1> ${data.user ? `You&#39;re logged in` : ``}`;
});
export {
  Page as default
};
