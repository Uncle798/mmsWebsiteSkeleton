import { MailtrapClient } from "mailtrap";
const token = process.env.MAILTRAP_TOKEN;
const mailtrap = new MailtrapClient({ token });
export {
  mailtrap as m
};
