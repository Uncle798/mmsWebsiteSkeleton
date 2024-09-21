import { c as create_ssr_component, e as escape } from "./ssr.js";
const NameBlock = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  let { nameBlock } = $$props;
  if ($$props.nameBlock === void 0 && $$bindings.nameBlock && nameBlock !== void 0) $$bindings.nameBlock(nameBlock);
  return `<div class="card p-4"><span><h3 class="h3">${escape(nameBlock.givenName)} ${escape(nameBlock.familyName)}</h3></span> <span><p>${escape(nameBlock.email)}</p> ${nameBlock.organizationName ? `<p>${escape(nameBlock.organizationName)}</p>` : ``} ${nameBlock.employee ? `<p><strong data-svelte-h="svelte-b5zltg">Employee</strong></p>` : ``} ${nameBlock.admin ? `<p><strong data-svelte-h="svelte-1554a33">Admin</strong></p>` : ``}</span></div>`;
});
export {
  NameBlock as N
};
