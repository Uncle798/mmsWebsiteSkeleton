import { v as validate_store, b as subscribe } from "../../../../chunks/lifecycle.js";
import { c as create_ssr_component, e as escape, v as validate_component, d as each, a as add_attribute } from "../../../../chunks/ssr.js";
import { P as PUBLIC_COMPANY_NAME } from "../../../../chunks/public.js";
import "../../../../chunks/client.js";
import { s as superForm } from "../../../../chunks/formData.js";
import "../../../../chunks/index.js";
import { N as NameBlock } from "../../../../chunks/NameBlock.js";
import { A as Address } from "../../../../chunks/Address.js";
import { g as getToastStore } from "../../../../chunks/stores2.js";
import "../../../../chunks/ProgressBar.svelte_svelte_type_style_lang.js";
const BasicUnitCustomer = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  let { unit } = $$props;
  let { pricing } = $$props;
  if ($$props.unit === void 0 && $$bindings.unit && unit !== void 0) $$bindings.unit(unit);
  if ($$props.pricing === void 0 && $$bindings.pricing && pricing !== void 0) $$bindings.pricing(pricing);
  return `<div class="card p-4"><h3>Unit: ${escape(unit.num.replace(/^0+/gm, ""))}</h3> <p>Building: ${escape(unit.building)}</p> <p>Size: ${escape(unit.size)}</p> <p>Price: $${escape(pricing.price)} per month</p> <p>Deposit: $${escape(pricing.price)}</p></div>`;
});
const Page = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  let $message, $$unsubscribe_message;
  let { data } = $$props;
  const { form, errors, constraints, message, enhance } = superForm(data.form);
  validate_store(message, "message");
  $$unsubscribe_message = subscribe(message, (value) => $message = value);
  getToastStore();
  data.newLease;
  if ($$props.data === void 0 && $$bindings.data && data !== void 0) $$bindings.data(data);
  $$unsubscribe_message();
  return `${$$result.head += `<!-- HEAD_svelte-1yupozv_START -->${$$result.title = `<title>${escape(PUBLIC_COMPANY_NAME)} | Customer New Lease</title>`, ""}<!-- HEAD_svelte-1yupozv_END -->`, ""} ${$message ? `<h3>${escape($message)}</h3>` : ``} ${data.user ? `${validate_component(NameBlock, "NameBlock").$$render($$result, { nameBlock: data.user }, {}, {})}` : ``} <form method="post">${data.address ? `${each(data.address, (address, index) => {
    return `<div class="flex">${validate_component(Address, "Address").$$render($$result, { address }, {}, {})} ${index === 0 ? `<input type="radio" name="contactInfoId"${add_attribute("id", address.contactId, 0)}${add_attribute("value", address.contactId, 0)} checked class="radio">` : `<input type="radio" name="contactInfoId"${add_attribute("id", address.contactId, 0)}${add_attribute("value", address.contactId, 0)} class="radio">`}</div> ${data.user?.organizationName ? `<div><label for="orgainzation">This unit is being rented by an organization (Company, Non Profit, ect)
               <input type="checkbox" name="organization" id="organization" checked></label> </div>` : ``}`;
  })}` : `<a class="a" href="/register/addressFrom" data-svelte-h="svelte-1qdkjgz">Please add your address</a>`} ${data.unit && data.unitPrice ? `${validate_component(BasicUnitCustomer, "BasicUnitCustomer").$$render($$result, { unit: data.unit, pricing: data.unitPrice }, {}, {})}` : ``} ${data.user && data.address && data.unitPrice ? `<input type="hidden" name="unitPriceId" id="unitPriceId"${add_attribute("value", data.unitPrice.unitPricingId, 0)}> <input type="hidden" name="unitNum" id="unitNum"${add_attribute("value", data.unit.num, 0)}> <button class="btn" data-svelte-h="svelte-kj9dgk">All the above is correct pay deposit</button>` : ``}</form>`;
});
export {
  Page as default
};
