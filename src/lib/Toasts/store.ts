import type { SvelteComponent } from 'svelte';
import { writable } from 'svelte/store'
export const toasts = writable([]);

export type Toast = {
   id: string;
   type: string;
   dismissible: boolean;
   timeout: number;
   message: string;
}

export const addToast = (toast:Toast) =>{
   const id = Math.floor(Math.random()*10000);
   const defaults = {
      id,
      type: 'info', 
      dismissible: true,
      timeout: 3000,
      message: 'Are you sure?'
   }
   toasts.update((all) =>[{ ...defaults, ...toast }, ...all ]);
   if(toast.timeout){
      setTimeout(()=> dismissToast(id), toast.timeout)
   }
}
export const dismissToast = (/** @type {number} */ id) =>{
   toasts.update((all) => all.filter((t) => t.id !== id))
}