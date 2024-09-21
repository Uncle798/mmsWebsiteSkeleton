import { v as validate_store, b as subscribe } from "../../../../chunks/lifecycle.js";
import { c as create_ssr_component, e as escape, s as spread, f as escape_attribute_value, b as escape_object, a as add_attribute } from "../../../../chunks/ssr.js";
import "../../../../chunks/client.js";
import { s as superForm } from "../../../../chunks/formData.js";
import "../../../../chunks/index.js";
const Page = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  let $message, $$unsubscribe_message;
  let $errors, $$unsubscribe_errors;
  let $constraints, $$unsubscribe_constraints;
  let $form, $$unsubscribe_form;
  let { data } = $$props;
  const { form, message, errors, constraints, enhance } = superForm(data.form);
  validate_store(form, "form");
  $$unsubscribe_form = subscribe(form, (value) => $form = value);
  validate_store(message, "message");
  $$unsubscribe_message = subscribe(message, (value) => $message = value);
  validate_store(errors, "errors");
  $$unsubscribe_errors = subscribe(errors, (value) => $errors = value);
  validate_store(constraints, "constraints");
  $$unsubscribe_constraints = subscribe(constraints, (value) => $constraints = value);
  if ($$props.data === void 0 && $$bindings.data && data !== void 0) $$bindings.data(data);
  $$unsubscribe_message();
  $$unsubscribe_errors();
  $$unsubscribe_constraints();
  $$unsubscribe_form();
  return `${$message ? `<h3>${escape($message)}</h3>` : ``} <form method="post"><label for="email" data-svelte-h="svelte-cq2b9">Please enter your registered email address</label> <input${spread(
    [
      { type: "email" },
      { name: "email" },
      { id: "email" },
      { class: "input" },
      {
        "aria-invalid": escape_attribute_value($errors.email ? true : void 0)
      },
      escape_object($constraints.email)
    ],
    {}
  )}${add_attribute("value", $form.email, 0)}> ${$errors.email ? `<span class="invalid">${escape($errors.email)}</span>` : ``} <button type="submit" class="btn" data-svelte-h="svelte-ftul3o">Reset password</button></form>`;
});
export {
  Page as default
};
