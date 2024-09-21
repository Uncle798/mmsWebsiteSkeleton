import { v as validate_store, b as subscribe } from "./lifecycle.js";
import { c as create_ssr_component, g as add_classes, d as each, e as escape } from "./ssr.js";
import "./RowsPerPage.js";
const Pagination = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  let $currentPage, $$unsubscribe_currentPage;
  let $pages, $$unsubscribe_pages;
  let $pageCount, $$unsubscribe_pageCount;
  let { handler } = $$props;
  const currentPage = handler.getPageNumber();
  validate_store(currentPage, "currentPage");
  $$unsubscribe_currentPage = subscribe(currentPage, (value) => $currentPage = value);
  const pageCount = handler.getPageCount();
  validate_store(pageCount, "pageCount");
  $$unsubscribe_pageCount = subscribe(pageCount, (value) => $pageCount = value);
  const pages = handler.getPages({ ellipsis: true });
  validate_store(pages, "pages");
  $$unsubscribe_pages = subscribe(pages, (value) => $pages = value);
  if ($$props.handler === void 0 && $$bindings.handler && handler !== void 0) $$bindings.handler(handler);
  $$unsubscribe_currentPage();
  $$unsubscribe_pages();
  $$unsubscribe_pageCount();
  return `<section><button type="button"${add_classes(($currentPage === 1 ? "disabled" : "").trim())} data-svelte-h="svelte-17cg3go">Previous</button> ${each($pages, (page) => {
    return `<button type="button"${add_classes((($currentPage === page ? "active" : "") + " " + (page === null ? "ellipse" : "")).trim())}>${escape(page ?? "...")} </button>`;
  })} <button type="button"${add_classes(($currentPage === $pageCount ? "disabled" : "").trim())} data-svelte-h="svelte-ik2vsx">Next</button></section>`;
});
export {
  Pagination as P
};
