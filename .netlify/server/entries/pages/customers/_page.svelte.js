import { v as validate_store, b as subscribe } from "../../../chunks/lifecycle.js";
import { c as create_ssr_component, v as validate_component, d as each, e as escape } from "../../../chunks/ssr.js";
import { D as DataHandler, S as Search, R as RowsPerPage, T as ThFilter } from "../../../chunks/RowsPerPage.js";
import { T as Th } from "../../../chunks/Th.js";
import { P as Pagination } from "../../../chunks/Pagination.js";
import { g as getModalStore } from "../../../chunks/stores.js";
import "../../../chunks/ProgressBar.svelte_svelte_type_style_lang.js";
import "../../../chunks/client.js";
import "../../../chunks/formData.js";
import "../../../chunks/index.js";
const Page = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  let $rows, $$unsubscribe_rows;
  let { data } = $$props;
  const handler = new DataHandler(data.tableData, { rowsPerPage: 50 });
  const rows = handler.getRows();
  validate_store(rows, "rows");
  $$unsubscribe_rows = subscribe(rows, (value) => $rows = value);
  getModalStore();
  if ($$props.data === void 0 && $$bindings.data && data !== void 0) $$bindings.data(data);
  $$unsubscribe_rows();
  return `<div class="table-container"><table class="table table-hover"><thead class="table-header-group table"><tr class="table-row">${validate_component(Search, "Search").$$render($$result, { handler }, {}, {})} ${validate_component(RowsPerPage, "RowsPerPage").$$render($$result, { handler }, {}, {})}</tr> <tr class="table-row">${validate_component(Th, "Th").$$render($$result, { handler }, {}, {
    default: () => {
      return `Unit Num`;
    }
  })} ${validate_component(Th, "Th").$$render($$result, { handler }, {}, {
    default: () => {
      return `Lease Price`;
    }
  })} ${validate_component(Th, "Th").$$render($$result, { handler }, {}, {
    default: () => {
      return `Family name`;
    }
  })} ${validate_component(Th, "Th").$$render($$result, { handler }, {}, {
    default: () => {
      return `Given name`;
    }
  })} ${validate_component(Th, "Th").$$render($$result, { handler }, {}, {
    default: () => {
      return `Email address`;
    }
  })} <td data-svelte-h="svelte-by1wdn">End Lease</td></tr> <tr class="table-row">${validate_component(ThFilter, "ThFilter").$$render($$result, { handler, filterBy: "unitNum" }, {}, {})} ${validate_component(ThFilter, "ThFilter").$$render($$result, { handler, filterBy: "price" }, {}, {})} ${validate_component(ThFilter, "ThFilter").$$render($$result, { handler, filterBy: "familyName" }, {}, {})} ${validate_component(ThFilter, "ThFilter").$$render($$result, { handler, filterBy: "givenName" }, {}, {})} ${validate_component(ThFilter, "ThFilter").$$render($$result, { handler, filterBy: "email" }, {}, {})}</tr></thead> <tbody>${each($rows, (row) => {
    return `<tr><td><a href="${"/units/" + escape(row.unitNum, true)}">${escape(row.unitNum.replace(/^0+/gm, ""))}</a></td> <td><a href="${"/units/" + escape(row.unitNum, true)}">$${escape(row.price)}</a></td> <td class="td"><a href="${"/users/" + escape(row.id, true)}">${escape(row.familyName)}</a></td> <td><a href="${"/users/" + escape(row.id, true)}">${escape(row.givenName)}</a></td> <td><a href="${"/users/" + escape(row.id, true)}">${escape(row.email)}</a></td> <td><button class="btn" data-svelte-h="svelte-1jdx1ns">End Lease</button></td> </tr>`;
  })}</tbody></table></div> <footer>${validate_component(Pagination, "Pagination").$$render($$result, { handler }, {}, {})}</footer>`;
});
export {
  Page as default
};
