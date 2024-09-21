import { v as validate_store, b as subscribe } from "../../../chunks/lifecycle.js";
import { c as create_ssr_component, e as escape, a as add_attribute, d as each, v as validate_component } from "../../../chunks/ssr.js";
import { P as PUBLIC_COMPANY_NAME } from "../../../chunks/public.js";
import { g as getModalStore } from "../../../chunks/stores.js";
import "../../../chunks/ProgressBar.svelte_svelte_type_style_lang.js";
import "../../../chunks/client.js";
import "../../../chunks/formData.js";
import "../../../chunks/index.js";
import { N as NameBlock } from "../../../chunks/NameBlock.js";
import { w as writable } from "../../../chunks/index2.js";
const createSearchStore = (data) => {
  const { subscribe: subscribe2, set, update } = writable({
    data,
    filtered: data,
    search: ""
  });
  return { subscribe: subscribe2, set, update };
};
const searchHandler = (store) => {
  const searchTerms = store.search.toLowerCase() || "";
  store.filtered = store.data.filter((item) => {
    return item.searchTerms.toLowerCase().includes(searchTerms);
  });
};
const Page = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  let $searchStore, $$unsubscribe_searchStore;
  let { data } = $$props;
  const searchUsers = data.users.map((user) => ({
    ...user,
    searchTerms: `${user.givenName} ${user.familyName} ${user.email}`
  }));
  const searchStore = createSearchStore(searchUsers);
  validate_store(searchStore, "searchStore");
  $$unsubscribe_searchStore = subscribe(searchStore, (value) => $searchStore = value);
  searchStore.subscribe((model) => searchHandler(model));
  getModalStore();
  if ($$props.data === void 0 && $$bindings.data && data !== void 0) $$bindings.data(data);
  $$unsubscribe_searchStore();
  return `${$$result.head += `<!-- HEAD_svelte-1ju7cji_START -->${$$result.title = `<title>${escape(PUBLIC_COMPANY_NAME)} | All Users</title>`, ""}<!-- HEAD_svelte-1ju7cji_END -->`, ""} <div><input type="search" name="search" id="search" placeholder="Search..." class="input"${add_attribute("value", $searchStore.search, 0)}></div> ${each($searchStore.filtered, (user) => {
    return `<div class="flex">${validate_component(NameBlock, "NameBlock").$$render($$result, { nameBlock: user }, {}, {})} <div class="card"><button data-svelte-h="svelte-4ya6ve">Change employment status</button></div> </div>`;
  })}`;
});
export {
  Page as default
};
