import * as server from '../entries/pages/units/_unitNum_/_page.server.ts.js';

export const index = 12;
let component_cache;
export const component = async () => component_cache ??= (await import('../entries/pages/units/_unitNum_/_page.svelte.js')).default;
export { server };
export const server_id = "src/routes/units/[unitNum]/+page.server.ts";
export const imports = ["_app/immutable/nodes/12.DmVv0e93.js","_app/immutable/chunks/scheduler.BxntsWxz.js","_app/immutable/chunks/index.CIBjKfq4.js","_app/immutable/chunks/public.95Q0c9gy.js"];
export const stylesheets = [];
export const fonts = [];
