import * as server from '../entries/pages/units/newLease/leaseSent/_page.server.ts.js';

export const index = 15;
let component_cache;
export const component = async () => component_cache ??= (await import('../entries/pages/units/newLease/leaseSent/_page.svelte.js')).default;
export { server };
export const server_id = "src/routes/units/newLease/leaseSent/+page.server.ts";
export const imports = ["_app/immutable/nodes/15.B0kv6yWH.js","_app/immutable/chunks/scheduler.BxntsWxz.js","_app/immutable/chunks/index.CIBjKfq4.js","_app/immutable/chunks/public.95Q0c9gy.js"];
export const stylesheets = [];
export const fonts = [];
