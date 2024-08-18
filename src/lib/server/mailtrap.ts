import { MailtrapClient } from "mailtrap";

const token = process.env.NODEMAILER_PASSWORD!;
export const mailtrap = new MailtrapClient({token})