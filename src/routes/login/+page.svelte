<script lang="ts">
   // @ts-ignore: it works
   import { PUBLIC_COMPANY_NAME } from '$env/static/public'
   import { error } from '@sveltejs/kit';
   import { superForm } from 'sveltekit-superforms'
   import { getToastStore, type ToastSettings } from "@skeletonlabs/skeleton";
	import { onMount } from 'svelte';
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
      })();
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
<form method="POST" use:enhance>
   <label for="email">email
      <input type="email"
      name="email"
      class="input" 
      aria-invalid={$errors.email ? 'true' : undefined } 
      bind:value={$form.email}
      {...$constraints.email}
      />
   </label>
      {#if $errors.email}
      <span class="input-error">{$errors.email}</span>
      {/if}
   <label for="password">password

      <input type="password" name="password" 
      id="password"
      class="input" 
      aria-invalid={$errors.password ? 'true' : undefined}
      bind:value={$form.password}
      {...$constraints.password}
      />
   </label>
      {#if $errors.password}
      <span class="input-error">{$errors.password}</span>
      {/if}
   <button class="btn">Submit</button>
</form>

<a href="/login/resetPassword">Forgot your password?</a>