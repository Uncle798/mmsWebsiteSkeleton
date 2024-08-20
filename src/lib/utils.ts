import type { RequestEvent } from "@sveltejs/kit";

export function handleLoginRedirect(event:RequestEvent, message: string = 'You must be logged in to access that page'){
   const redirect = event.url.pathname + event.url.search;

   return `login?redirectTo=${redirect}&message=${message}`
}