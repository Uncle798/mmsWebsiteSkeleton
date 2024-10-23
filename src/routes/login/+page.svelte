<script lang="ts">
  import { run } from 'svelte/legacy';

   // @ts-ignore: it works
   import { PUBLIC_COMPANY_NAME } from '$env/static/public'
   import { error } from '@sveltejs/kit';
   import { superForm } from 'sveltekit-superforms'
   import { getToastStore, type ToastSettings } from "@skeletonlabs/skeleton";
	import { onMount } from 'svelte';
	import LoginForm from '$lib/forms/LoginForm.svelte';
   const toastStore = getToastStore();
  let { data } = $props();
   const mess = data.mess
   run(() => {
    if (mess === 'notAllowed' && data.user?.employee) {
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
  });
   run(() => {
    if (mess && !data.user) {
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
  });
   run(() => {
    if (mess && data.user) {
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
  });
</script>

<svelte:head>
	<title>{PUBLIC_COMPANY_NAME} | Login</title>
</svelte:head>


<LoginForm data={data.form} />

<a href="/login/resetPassword">Forgot your password?</a>