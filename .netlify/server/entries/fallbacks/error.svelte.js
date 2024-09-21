import { v as validate_store, b as subscribe } from "../../chunks/lifecycle.js";
import { c as create_ssr_component, e as escape } from "../../chunks/ssr.js";
import { p as page } from "../../chunks/stores3.js";
const Error = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  let $page, $$unsubscribe_page;
  validate_store(page, "page");
  $$unsubscribe_page = subscribe(page, (value) => $page = value);
  $$unsubscribe_page();
  return `<h1>${escape($page.status)}</h1> <p>${escape($page.error?.message)}</p>`;
});
export {
  Error as default
};
