import * as server from '../entries/pages/register/emailVerification/_page.server.ts.js';

export const index = 10;
let component_cache;
export const component = async () => component_cache ??= (await import('../entries/pages/register/emailVerification/_page.svelte.js')).default;
export { server };
export const server_id = "src/routes/register/emailVerification/+page.server.ts";
export const imports = ["_app/immutable/nodes/10.ASgpyShF.js","_app/immutable/chunks/scheduler.BxntsWxz.js","_app/immutable/chunks/spread.CgU5AtxT.js","_app/immutable/chunks/index.CIBjKfq4.js","_app/immutable/chunks/public.95Q0c9gy.js","_app/immutable/chunks/entry.CaHJRPzi.js","_app/immutable/chunks/index.dgzJtdmL.js","_app/immutable/chunks/formData.Cbx_nTpJ.js","_app/immutable/chunks/stores.Dkjdz3Pn.js","_app/immutable/chunks/index.DdPxwcRY.js","_app/immutable/chunks/dev-browser.CoG0geaG.js","_app/immutable/chunks/forms.BHfpwDEG.js"];
export const stylesheets = [];
export const fonts = [];
