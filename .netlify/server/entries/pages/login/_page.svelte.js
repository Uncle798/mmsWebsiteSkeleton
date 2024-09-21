import { v as validate_store, b as subscribe } from "../../../chunks/lifecycle.js";
import { c as create_ssr_component, e as escape, s as spread, f as escape_attribute_value, b as escape_object, a as add_attribute } from "../../../chunks/ssr.js";
import { P as PUBLIC_COMPANY_NAME } from "../../../chunks/public.js";
import "../../../chunks/index.js";
import "../../../chunks/client.js";
import { s as superForm } from "../../../chunks/formData.js";
import { g as getToastStore } from "../../../chunks/stores2.js";
import "../../../chunks/ProgressBar.svelte_svelte_type_style_lang.js";
const Page = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  let $message, $$unsubscribe_message;
  let $errors, $$unsubscribe_errors;
  let $constraints, $$unsubscribe_constraints;
  let $form, $$unsubscribe_form;
  getToastStore();
  let { data } = $$props;
  const mess = data.mess;
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
  {
    if (mess === "notAllowed" && data.user?.employee) ;
  }
  {
    if (mess && !data.user) ;
  }
  {
    if (mess && data.user) ;
  }
  $$unsubscribe_message();
  $$unsubscribe_errors();
  $$unsubscribe_constraints();
  $$unsubscribe_form();
  return `${$$result.head += `<!-- HEAD_svelte-revyn4_START -->${$$result.title = `<title>${escape(PUBLIC_COMPANY_NAME)} | Login</title>`, ""}<!-- HEAD_svelte-revyn4_END -->`, ""} ${$message ? `${escape($message)}` : ``} <form method="POST"><label for="email">email
      <input${spread(
    [
      { type: "email" },
      { name: "email" },
      { class: "input" },
      {
        "aria-invalid": escape_attribute_value($errors.email ? "true" : void 0)
      },
      escape_object($constraints.email)
    ],
    {}
  )}${add_attribute("value", $form.email, 0)}></label> ${$errors.email ? `<span class="input-error">${escape($errors.email)}</span>` : ``} <label for="password">password

      <input${spread(
    [
      { type: "password" },
      { name: "password" },
      { id: "password" },
      { class: "input" },
      {
        "aria-invalid": escape_attribute_value($errors.password ? "true" : void 0)
      },
      escape_object($constraints.password)
    ],
    {}
  )}${add_attribute("value", $form.password, 0)}></label> ${$errors.password ? `<span class="input-error">${escape($errors.password)}</span>` : ``} <button class="btn" data-svelte-h="svelte-1cwbnmx">Submit</button></form> <a href="/login/resetPassword" data-svelte-h="svelte-1i4jwof">Forgot your password?</a>`;
});
export {
  Page as default
};
