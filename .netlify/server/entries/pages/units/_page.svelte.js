import { v as validate_store, b as subscribe } from "../../../chunks/lifecycle.js";
import { c as create_ssr_component, e as escape, v as validate_component, d as each } from "../../../chunks/ssr.js";
import { P as PUBLIC_COMPANY_NAME } from "../../../chunks/public.js";
import { D as DataHandler, S as Search, R as RowsPerPage, T as ThFilter } from "../../../chunks/RowsPerPage.js";
import { P as Pagination } from "../../../chunks/Pagination.js";
const Page = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  let $rows, $$unsubscribe_rows;
  let { data } = $$props;
  const handler = new DataHandler(data.tableData, { rowsPerPage: 50 });
  const rows = handler.getRows();
  validate_store(rows, "rows");
  $$unsubscribe_rows = subscribe(rows, (value) => $rows = value);
  if ($$props.data === void 0 && $$bindings.data && data !== void 0) $$bindings.data(data);
  $$unsubscribe_rows();
  return `${$$result.head += `<!-- HEAD_svelte-k8z3ge_START -->${$$result.title = `<title>${escape(PUBLIC_COMPANY_NAME)} | All Units</title>`, ""}<!-- HEAD_svelte-k8z3ge_END -->`, ""} <div class="table-container"><header>${validate_component(Search, "Search").$$render($$result, { handler }, {}, {})} ${validate_component(RowsPerPage, "RowsPerPage").$$render($$result, { handler }, {}, {})}</header> <table class="table table-hover"><thead><tr><th class="table-cell-fit" data-svelte-h="svelte-1dltpm0">Unit num</th> <th data-svelte-h="svelte-89avcu">Customer</th> <th data-svelte-h="svelte-wbywa8">Lease price / Current Price</th> <th data-svelte-h="svelte-1welvhd">Leased since / Empty for</th></tr> <tr>${validate_component(ThFilter, "ThFilter").$$render($$result, { handler, filterBy: "unitNum" }, {}, {})} ${validate_component(ThFilter, "ThFilter").$$render($$result, { handler, filterBy: "familyName" }, {}, {})} ${validate_component(ThFilter, "ThFilter").$$render($$result, { handler, filterBy: "price" }, {}, {})} ${validate_component(ThFilter, "ThFilter").$$render($$result, { handler, filterBy: "emptyFor" }, {}, {})}</tr></thead> <tbody>${each($rows, (row) => {
    return `<tr><td class="table-cell-fit"><a href="${"/units/" + escape(row.unitNum, true)}">${escape(row.unitNum.replace(/^0+/gm, ""))}</a></td> ${row.emptyFor > 0 ? `<td data-svelte-h="svelte-zb7pxj">Empty Unit</td> <td>$${escape(row.price)}</td> <td>${escape(row.emptyFor)} months</td>` : `<td><a class="a" href="${"/users/" + escape(row.userId, true)}">${escape(row.familyName)}, ${escape(row.givenName)} ${row.organizationName ? `, ${escape(row.organizationName)}` : ``} </a></td> <td>$${escape(row.price)}</td> <td>${escape(row.leasedFor)} months</td>`} </tr>`;
  })}</tbody></table> <footer>${validate_component(Pagination, "Pagination").$$render($$result, { handler }, {}, {})}</footer></div>`;
});
export {
  Page as default
};
