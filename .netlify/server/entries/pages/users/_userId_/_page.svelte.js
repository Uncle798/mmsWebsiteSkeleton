import { v as validate_store, b as subscribe } from "../../../../chunks/lifecycle.js";
import { c as create_ssr_component, e as escape, v as validate_component, d as each } from "../../../../chunks/ssr.js";
import { P as PUBLIC_COMPANY_NAME } from "../../../../chunks/public.js";
import { A as Address } from "../../../../chunks/Address.js";
import { N as NameBlock } from "../../../../chunks/NameBlock.js";
import { T as Th } from "../../../../chunks/Th.js";
import { D as DataHandler, S as Search, R as RowsPerPage, T as ThFilter } from "../../../../chunks/RowsPerPage.js";
const BasicLease = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  let { lease } = $$props;
  if ($$props.lease === void 0 && $$bindings.lease && lease !== void 0) $$bindings.lease(lease);
  return `<div class="card p-4"><span><h3>Unit Number: ${escape(lease.unitNum.replace(/^0+/gm, ""))}</h3> <h4>Price: $${escape(lease.price)}</h4></span> <p>Lease effective Date: ${escape(lease.leaseEffectiveDate.getMonth())}/${escape(lease.leaseEffectiveDate.getDate())}/${escape(lease.leaseEffectiveDate.getFullYear())}</p> ${lease.leaseEnded ? `<p>Lease ended: ${escape(lease.leaseEnded.getMonth())}/${escape(lease.leaseEnded.getDate())}/${escape(lease.leaseEnded.getFullYear())}</p>` : ``}</div>`;
});
const Page = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  let $rowCount, $$unsubscribe_rowCount;
  let $paymentSum, $$unsubscribe_paymentSum;
  let $rows, $$unsubscribe_rows;
  let { data } = $$props;
  const { contactInfo, dbUser, leases, tableData } = data;
  const handler = new DataHandler(tableData, { rowsPerPage: 10 });
  const rows = handler.getRows();
  validate_store(rows, "rows");
  $$unsubscribe_rows = subscribe(rows, (value) => $rows = value);
  const rowCount = handler.getRowCount();
  validate_store(rowCount, "rowCount");
  $$unsubscribe_rowCount = subscribe(rowCount, (value) => $rowCount = value);
  const paymentSum = handler.createCalculation("amount").sum();
  validate_store(paymentSum, "paymentSum");
  $$unsubscribe_paymentSum = subscribe(paymentSum, (value) => $paymentSum = value);
  if ($$props.data === void 0 && $$bindings.data && data !== void 0) $$bindings.data(data);
  if ($$props.contactInfo === void 0 && $$bindings.contactInfo && contactInfo !== void 0) $$bindings.contactInfo(contactInfo);
  if ($$props.dbUser === void 0 && $$bindings.dbUser && dbUser !== void 0) $$bindings.dbUser(dbUser);
  if ($$props.leases === void 0 && $$bindings.leases && leases !== void 0) $$bindings.leases(leases);
  if ($$props.tableData === void 0 && $$bindings.tableData && tableData !== void 0) $$bindings.tableData(tableData);
  $$unsubscribe_rowCount();
  $$unsubscribe_paymentSum();
  $$unsubscribe_rows();
  return `${$$result.head += `<!-- HEAD_svelte-ywdwff_START -->${$$result.title = `<title>${escape(PUBLIC_COMPANY_NAME)} | User: ${escape(dbUser?.givenName)} ${escape(dbUser?.familyName)}</title>`, ""}<!-- HEAD_svelte-ywdwff_END -->`, ""} ${dbUser ? `${validate_component(NameBlock, "NameBlock").$$render($$result, { nameBlock: dbUser }, {}, {})}` : ``} ${each(contactInfo, (info) => {
    return `${validate_component(Address, "Address").$$render($$result, { address: info }, {}, {})}`;
  })} ${each(leases, (lease) => {
    return `${validate_component(BasicLease, "BasicLease").$$render($$result, { lease }, {}, {})}`;
  })} ${$rowCount.total > 0 ? `<header>${validate_component(Search, "Search").$$render($$result, { handler }, {}, {})} ${validate_component(RowsPerPage, "RowsPerPage").$$render($$result, { handler }, {}, {})}</header> <table class="table-container table-hover"><thead><tr>${validate_component(Th, "Th").$$render($$result, { handler }, {}, {
    default: () => {
      return `Invoice Amount`;
    }
  })} ${validate_component(Th, "Th").$$render($$result, { handler }, {}, {
    default: () => {
      return `Invoice num`;
    }
  })} ${validate_component(Th, "Th").$$render($$result, { handler }, {}, {
    default: () => {
      return `Payment Completed`;
    }
  })} ${validate_component(Th, "Th").$$render($$result, { handler }, {}, {
    default: () => {
      return `Payment type`;
    }
  })} ${validate_component(Th, "Th").$$render($$result, { handler }, {}, {
    default: () => {
      return `Customer`;
    }
  })}</tr> <tr>${validate_component(ThFilter, "ThFilter").$$render($$result, { handler, filterBy: "amount" }, {}, {})} ${validate_component(ThFilter, "ThFilter").$$render($$result, { handler, filterBy: "paymentId" }, {}, {})} ${validate_component(ThFilter, "ThFilter").$$render($$result, { handler, filterBy: "paymentType" }, {}, {})} ${validate_component(ThFilter, "ThFilter").$$render($$result, { handler, filterBy: "customer" }, {}, {})}</tr> <tr><th>$${escape($paymentSum)} total payments</th></tr></thead> <tbody>${each($rows, (row) => {
    return `<tr><td>$${escape(row.amount)}</td> <td>${escape(row.invoiceNum)}</td> <td>${escape(row.paymentCompleted?.getDate())}/${escape(row.paymentCompleted?.getMonth())}/${escape(row.paymentCompleted?.getFullYear())}</td> <td>${escape(row.paymentType)}</td> <td>${escape(row.familyName)}, ${escape(row.givenName)}</td> </tr>`;
  })}</tbody></table>` : ``}`;
});
export {
  Page as default
};
