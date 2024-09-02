import type { RequestEvent } from "@sveltejs/kit";

export function handleLoginRedirect(event:RequestEvent, message: string = 'notAllowed'){
   const redirect = event.url.pathname + event.url.search;

   return `/login?redirectTo=${redirect}&message=${message}`
}