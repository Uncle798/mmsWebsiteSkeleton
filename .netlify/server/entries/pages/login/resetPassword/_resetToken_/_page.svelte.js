import { v as validate_store, b as subscribe } from "../../../../../chunks/lifecycle.js";
import { c as create_ssr_component, e as escape, s as spread, f as escape_attribute_value, b as escape_object, a as add_attribute } from "../../../../../chunks/ssr.js";
import "../../../../../chunks/client.js";
import { s as superForm } from "../../../../../chunks/formData.js";
import "../../../../../chunks/index.js";
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
  return `${$message ? `<h3>${escape($message)}</h3>` : ``} <form method="post"><label for="password" data-svelte-h="svelte-b3r6vt">Please enter a new password</label> <input${spread(
    [
      { type: "password" },
      { name: "password" },
      { id: "password" },
      { class: "input" },
      {
        "aria-invalid": escape_attribute_value($errors.password ? true : void 0)
      },
      escape_object($constraints.password)
    ],
    {}
  )}${add_attribute("value", $form.password, 0)}> ${$errors.password ? `<span class="invalid">${escape($errors.password)}</span>` : ``} <label for="password" data-svelte-h="svelte-1uyvrtf">Please confirm your new password</label> <input${spread(
    [
      { type: "password" },
      { name: "passwordConfirm" },
      { id: "passwordConfirm" },
      { class: "input" },
      {
        "aria-invalid": escape_attribute_value($errors.passwordConfirm ? true : void 0)
      },
      escape_object($constraints.passwordConfirm)
    ],
    {}
  )}${add_attribute("value", $form.passwordConfirm, 0)}> ${$errors.passwordConfirm ? `<span class="invalid">${escape($errors.passwordConfirm)}</span>` : ``} <p><button type="submit" class="btn" data-svelte-h="svelte-ftul3o">Reset password</button></p></form>`;
});
export {
  Page as default
};
