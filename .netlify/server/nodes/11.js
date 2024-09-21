import * as server from '../entries/pages/units/_page.server.ts.js';

export const index = 11;
let component_cache;
export const component = async () => component_cache ??= (await import('../entries/pages/units/_page.svelte.js')).default;
export { server };
export const server_id = "src/routes/units/+page.server.ts";
export const imports = ["_app/immutable/nodes/11.CTfCNvGk.js","_app/immutable/chunks/scheduler.BxntsWxz.js","_app/immutable/chunks/index.CIBjKfq4.js","_app/immutable/chunks/public.95Q0c9gy.js","_app/immutable/chunks/Pagination.CFgtquEx.js","_app/immutable/chunks/index.dgzJtdmL.js"];
export const stylesheets = ["_app/immutable/assets/Pagination.B6XqG18y.css"];
export const fonts = [];
