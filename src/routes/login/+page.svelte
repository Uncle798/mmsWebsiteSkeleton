<script lang="ts">
   // @ts-ignore: it works
   import { PUBLIC_COMPANY_NAME } from '$env/static/public'
   import { error } from '@sveltejs/kit';
   import { superForm } from 'sveltekit-superforms'
   import { getToastStore, type ToastSettings } from "@skeletonlabs/skeleton";
	import { onMount } from 'svelte';
	import LoginForm from '$lib/forms/LoginForm.svelte';
   const toastStore = getToastStore();
   export let data;
   const mess = data.mess
   $: if (mess === 'notAllowed' && data.user?.employee) {
    onMount(() => {
      // You cannot use async directly in onMount's function, so we need a workaround wrapping () around async 
      (async () => {
        const toast: ToastSettings = {
          message: 'You must be an admin to access that page',
          timeout: 5000,
          background: 'variant-filled-error'
        };
        toastStore.trigger(toast);
      });
    });
  }
   $: if (mess && !data.user) {
    onMount(() => {
      // You cannot use async directly in onMount's function, so we need a workaround wrapping () around async 
      (async () => {
        const toast: ToastSettings = {
          message: 'You must be logged in to access that page',
          timeout: 5000,
          background: 'variant-filled-error'
        };
        toastStore.trigger(toast);
      })();
    });
  }
   $: if (mess && data.user) {
    onMount(() => {
      // You cannot use async directly in onMount's function, so we need a workaround wrapping () around async 
      (async () => {
        const toast: ToastSettings = {
          message: 'You must be an admin to access that page',
          timeout: 5000,
          background: 'variant-filled-error'
        };
        toastStore.trigger(toast);
      })();
    });
  }


   const {form, errors, constraints, message, enhance} = superForm(data.form);
</script>

<svelte:head>
	<title>{PUBLIC_COMPANY_NAME} | Login</title>
</svelte:head>

{#if $message}
   {$message}
{/if}
<LoginForm data={data.form} />

<a href="/login/resetPassword">Forgot your password?</a>