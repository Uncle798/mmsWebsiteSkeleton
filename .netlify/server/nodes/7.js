import * as server from '../entries/pages/logout/_page.server.ts.js';

export const index = 7;
let component_cache;
export const component = async () => component_cache ??= (await import('../entries/pages/logout/_page.svelte.js')).default;
export { server };
export const server_id = "src/routes/logout/+page.server.ts";
export const imports = ["_app/immutable/nodes/7.BJBz0EnU.js","_app/immutable/chunks/scheduler.BxntsWxz.js","_app/immutable/chunks/index.CIBjKfq4.js","_app/immutable/chunks/public.95Q0c9gy.js","_app/immutable/chunks/forms.BHfpwDEG.js","_app/immutable/chunks/entry.CaHJRPzi.js","_app/immutable/chunks/index.dgzJtdmL.js"];
export const stylesheets = [];
export const fonts = [];
