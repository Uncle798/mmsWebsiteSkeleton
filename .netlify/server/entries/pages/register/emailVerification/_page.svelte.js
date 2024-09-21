import { v as validate_store, b as subscribe } from "../../../../chunks/lifecycle.js";
import { c as create_ssr_component, e as escape, s as spread, f as escape_attribute_value, b as escape_object, a as add_attribute } from "../../../../chunks/ssr.js";
import { P as PUBLIC_COMPANY_NAME } from "../../../../chunks/public.js";
import "../../../../chunks/client.js";
import { s as superForm } from "../../../../chunks/formData.js";
import "../../../../chunks/index.js";
const Page = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  let $message, $$unsubscribe_message;
  let $errors, $$unsubscribe_errors;
  let $constraints, $$unsubscribe_constraints;
  let $form, $$unsubscribe_form;
  let { data } = $$props;
  const { form, errors, constraints, message, enhance } = superForm(data.form);
  validate_store(form, "form");
  $$unsubscribe_form = subscribe(form, (value) => $form = value);
  validate_store(errors, "errors");
  $$unsubscribe_errors = subscribe(errors, (value) => $errors = value);
  validate_store(constraints, "constraints");
  $$unsubscribe_constraints = subscribe(constraints, (value) => $constraints = value);
  validate_store(message, "message");
  $$unsubscribe_message = subscribe(message, (value) => $message = value);
  if ($$props.data === void 0 && $$bindings.data && data !== void 0) $$bindings.data(data);
  $$unsubscribe_message();
  $$unsubscribe_errors();
  $$unsubscribe_constraints();
  $$unsubscribe_form();
  return `${$$result.head += `<!-- HEAD_svelte-13g3qzf_START -->${$$result.title = `<title>${escape(PUBLIC_COMPANY_NAME)} | Verify your email address</title>`, ""}<!-- HEAD_svelte-13g3qzf_END -->`, ""} <h1 data-svelte-h="svelte-zzmfge">Please verify your email address</h1> ${$message ? `<h3>${escape(message)}</h3>` : ``} <form method="post"><label class="label" for="code" data-svelte-h="svelte-1cr4d3v">Code:</label> <input${spread(
    [
      { type: "text" },
      { name: "code" },
      { class: "input" },
      {
        "aria-invalid": escape_attribute_value($errors.code ? true : void 0)
      },
      escape_object($constraints.code)
    ],
    {}
  )}${add_attribute("value", $form.code, 0)}> ${$errors.code ? `<span class="invalid">${escape($errors.code)}</span>` : ``} <button type="submit" class="btn" data-svelte-h="svelte-1g7hxpk">Submit</button></form>`;
});
export {
  Page as default
};
