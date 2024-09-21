import { v as validate_store, b as subscribe } from "../../../chunks/lifecycle.js";
import { c as create_ssr_component, e as escape, s as spread, f as escape_attribute_value, b as escape_object, a as add_attribute } from "../../../chunks/ssr.js";
import { P as PUBLIC_COMPANY_NAME } from "../../../chunks/public.js";
import { zxcvbnOptions, zxcvbn } from "@zxcvbn-ts/core";
import * as zxcvbnCommonPackage from "@zxcvbn-ts/language-common";
import * as zxcvbnEnPackage from "@zxcvbn-ts/language-en";
import "../../../chunks/client.js";
import { s as superForm } from "../../../chunks/formData.js";
import "../../../chunks/index.js";
const Page = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  let $form, $$unsubscribe_form;
  let $message, $$unsubscribe_message;
  let $errors, $$unsubscribe_errors;
  let $constraints, $$unsubscribe_constraints;
  let { data } = $$props;
  const { translations } = zxcvbnEnPackage;
  const { adjacencyGraphs: graphs, dictionary: commonDictionary } = zxcvbnCommonPackage;
  const { dictionary: englishDictionary } = zxcvbnEnPackage;
  const options = {
    translations,
    graphs,
    dictionary: {
      ...commonDictionary,
      ...englishDictionary
    }
  };
  zxcvbnOptions.setOptions(options);
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
  zxcvbn($form.password);
  $$unsubscribe_form();
  $$unsubscribe_message();
  $$unsubscribe_errors();
  $$unsubscribe_constraints();
  return `${$$result.head += `<!-- HEAD_svelte-jxqqry_START -->${$$result.title = `<title>${escape(PUBLIC_COMPANY_NAME)} | Register</title>`, ""}<!-- HEAD_svelte-jxqqry_END -->`, ""} ${$message ? `<h3>${escape($message)}</h3>` : ``} <form method="POST"><label for="email">Email
		<input${spread(
    [
      { type: "email" },
      { name: "email" },
      { class: "input" },
      { placeholder: "email@email.email" },
      {
        "aria-invalid": escape_attribute_value($errors.email ? "true" : void 0)
      },
      escape_object($constraints.email)
    ],
    {}
  )}${add_attribute("value", $form.email, 0)}></label> ${$errors.email ? `<span class="invalid">${escape($errors.email)}</span>` : ``} <label for="password">password

		<input${spread(
    [
      { type: "password" },
      { name: "password" },
      { id: "password" },
      { class: "input" },
      { autocomplete: "new-password" },
      { placeholder: "Password" },
      {
        "aria-invalid": escape_attribute_value($errors.password ? "true" : void 0)
      },
      escape_object($constraints.password)
    ],
    {}
  )}${add_attribute("value", $form.password, 0)}></label> ${$errors.password ? `<span class="input-error">${escape($errors.password)}</span>` : ``} <label for="passwordConfirm">Confirm your password

	<input${spread(
    [
      { type: "password" },
      { name: "passwordConfirm" },
      { id: "password" },
      { class: "input" },
      { placeholder: "Password again" },
      {
        "aria-invalid": escape_attribute_value($errors.passwordConfirm ? "true" : void 0)
      },
      escape_object($constraints.passwordConfirm)
    ],
    {}
  )}${add_attribute("value", $form.passwordConfirm, 0)}></label> ${$errors.passwordConfirm ? `<span class="input-error">${escape($errors.passwordConfirm)}</span>` : ``} ${``} <p><button type="submit" class="btn" data-svelte-h="svelte-1trnnlp">Register</button></p></form> ${data.unitNum ? `<p>Already have an account <a class="a" href="${"/login?unitNum=" + escape(data.unitNum, true)}">Login</a></p>` : `<p>Already have an account? <a class="a" href="/login" data-svelte-h="svelte-o2q6xt">Login</a></p>`}`;
});
export {
  Page as default
};
