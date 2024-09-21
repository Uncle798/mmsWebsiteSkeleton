import { c as create_ssr_component, e as escape } from "./ssr.js";
const Address = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  let { address } = $$props;
  if ($$props.address === void 0 && $$bindings.address && address !== void 0) $$bindings.address(address);
  return `<div class="card p-4"><p>${escape(address.address1)}</p> ${address.address2 ? `<p>${escape(address.address2)}</p>` : ``} ${address.address3 ? `<p>${escape(address.address3)}</p>` : ``} <p>${escape(address.city)}, ${escape(address.state)}, ${escape(address.zip)}</p></div>`;
});
export {
  Address as A
};
