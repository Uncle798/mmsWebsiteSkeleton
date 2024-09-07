import { Dropbox } from "dropbox";

export const dropbox = new Dropbox({accessToken: process.env.DROPBOX_ACCESS_TOKEN});