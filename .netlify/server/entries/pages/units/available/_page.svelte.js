import { v as validate_store, b as subscribe } from "../../../../chunks/lifecycle.js";
import { c as create_ssr_component, e as escape, v as validate_component, d as each } from "../../../../chunks/ssr.js";
import { P as PUBLIC_COMPANY_NAME } from "../../../../chunks/public.js";
import { D as DataHandler, S as Search, R as RowsPerPage, T as ThFilter } from "../../../../chunks/RowsPerPage.js";
import { P as Pagination } from "../../../../chunks/Pagination.js";
const Page = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  let $rows, $$unsubscribe_rows;
  let { data } = $$props;
  const handler = new DataHandler(data.availableUnits, { rowsPerPage: 50 });
  const rows = handler.getRows();
  validate_store(rows, "rows");
  $$unsubscribe_rows = subscribe(rows, (value) => $rows = value);
  if ($$props.data === void 0 && $$bindings.data && data !== void 0) $$bindings.data(data);
  $$unsubscribe_rows();
  return `${$$result.head += `<!-- HEAD_svelte-ifcc8n_START -->${$$result.title = `<title>${escape(PUBLIC_COMPANY_NAME)} | Available Units</title>`, ""}<!-- HEAD_svelte-ifcc8n_END -->`, ""} <header>${validate_component(Search, "Search").$$render($$result, { handler }, {}, {})} ${validate_component(RowsPerPage, "RowsPerPage").$$render($$result, { handler }, {}, {})}</header> <table class="table table-hover"><thead><tr><th data-svelte-h="svelte-wjcd73">Unit Number</th> <th data-svelte-h="svelte-5vfrm8">Size (WxL in feet)</th> <th data-svelte-h="svelte-rx7n5">Approximate amount of stuff</th> <th data-svelte-h="svelte-1nhce1i">Price per month</th></tr> <tr>${validate_component(ThFilter, "ThFilter").$$render($$result, { handler, filterBy: "unitNum" }, {}, {})} ${validate_component(ThFilter, "ThFilter").$$render($$result, { handler, filterBy: "size" }, {}, {})} ${validate_component(ThFilter, "ThFilter").$$render($$result, { handler, filterBy: "description" }, {}, {})} ${validate_component(ThFilter, "ThFilter").$$render($$result, { handler, filterBy: "price" }, {}, {})}</tr></thead> <tbody>${data.user ? `${each($rows, (row) => {
    return `<tr><td><a href="${"/units/newLease/?unitNum=" + escape(row.unitNum, true)}">${escape(row.unitNum.replace(/^0+/gm, ""))}</a></td> <td><a href="${"/units/newLease/?unitNum=" + escape(row.unitNum, true)}">${escape(row.size.replace(/^0+/gm, ""))}</a></td> <td><a href="${"/units/newLease/?unitNum=" + escape(row.unitNum, true)}">${escape(row.description)}</a></td> <td><a href="${"/units/newLease/?unitNum=" + escape(row.unitNum, true)}">$${escape(row.price)}</a></td> </tr>`;
  })}` : `${each($rows, (row) => {
    return `<tr><td><a href="${"/register?unitNum=" + escape(row.unitNum, true)}">${escape(row.unitNum.replace(/^0+/gm, ""))}</a></td> <td><a href="${"/register?unitNum=" + escape(row.unitNum, true)}">${escape(row.size.replace(/^0+/gm, ""))}</a></td> <td><a href="${"/register?unitNum=" + escape(row.unitNum, true)}">${escape(row.description)}</a></td> <td><a href="${"/register?unitNum=" + escape(row.unitNum, true)}">$${escape(row.price)}</a></td> </tr>`;
  })}`}</tbody></table> <footer>${validate_component(Pagination, "Pagination").$$render($$result, { handler }, {}, {})}</footer>`;
});
export {
  Page as default
};
