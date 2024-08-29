import { MailtrapClient } from "mailtrap";

const token = process.env.MAILTRAP_TOKEN!;
export const mailtrap = new MailtrapClient({token})