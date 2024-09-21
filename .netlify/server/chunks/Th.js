import { v as validate_store, b as subscribe } from "./lifecycle.js";
import { c as create_ssr_component, g as add_classes } from "./ssr.js";
const Th = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  let $sorted, $$unsubscribe_sorted;
  let { handler } = $$props;
  let { orderBy = "null" } = $$props;
  const identifier = orderBy.toString();
  const sorted = handler.getSort();
  validate_store(sorted, "sorted");
  $$unsubscribe_sorted = subscribe(sorted, (value) => $sorted = value);
  if ($$props.handler === void 0 && $$bindings.handler && handler !== void 0) $$bindings.handler(handler);
  if ($$props.orderBy === void 0 && $$bindings.orderBy && orderBy !== void 0) $$bindings.orderBy(orderBy);
  $$unsubscribe_sorted();
  return `<th${add_classes(($sorted.identifier === identifier ? "active" : "").trim())}><div class="flex"><strong>${slots.default ? slots.default({}) : ``}</strong> <span${add_classes((($sorted.direction === "asc" ? "asc" : "") + " " + ($sorted.direction === "desc" ? "desc" : "")).trim())}></span></div></th>`;
});
export {
  Th as T
};
