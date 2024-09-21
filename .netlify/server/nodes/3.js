import * as server from '../entries/pages/customers/_page.server.ts.js';

export const index = 3;
let component_cache;
export const component = async () => component_cache ??= (await import('../entries/pages/customers/_page.svelte.js')).default;
export { server };
export const server_id = "src/routes/customers/+page.server.ts";
export const imports = ["_app/immutable/nodes/3.B3OebxR9.js","_app/immutable/chunks/scheduler.BxntsWxz.js","_app/immutable/chunks/index.CIBjKfq4.js","_app/immutable/chunks/public.95Q0c9gy.js","_app/immutable/chunks/Pagination.CFgtquEx.js","_app/immutable/chunks/index.dgzJtdmL.js","_app/immutable/chunks/EmploymentConfirmModal.BOHqpzqY.js","_app/immutable/chunks/globals.D0QH3NT1.js","_app/immutable/chunks/spread.CgU5AtxT.js","_app/immutable/chunks/stores.wMhbYk0m.js","_app/immutable/chunks/ProgressBar.svelte_svelte_type_style_lang.WuPOumW6.js","_app/immutable/chunks/stores.Dkjdz3Pn.js","_app/immutable/chunks/entry.CaHJRPzi.js","_app/immutable/chunks/formData.Cbx_nTpJ.js","_app/immutable/chunks/index.DdPxwcRY.js","_app/immutable/chunks/dev-browser.CoG0geaG.js","_app/immutable/chunks/forms.BHfpwDEG.js"];
export const stylesheets = ["_app/immutable/assets/Pagination.B6XqG18y.css","_app/immutable/assets/ProgressBar.Cirlo5Z8.css"];
export const fonts = [];
