<script lang="ts">
   // @ts-ignore: it works
   import { PUBLIC_COMPANY_NAME } from '$env/static/public'
   import { superForm } from 'sveltekit-superforms';
   import type { PageData } from './$types';
	import { ProgressRadial } from '@skeletonlabs/skeleton';
   
   interface Props {
      data: PageData;
   }

   let { data }: Props = $props();
   const { form, errors, constraints, message, submitting, delayed, timeout, enhance } = superForm(data.form, {
      delayMs: 300,
      timeoutMs: 8000, 
   });
</script>

<svelte:head>
	<title>{PUBLIC_COMPANY_NAME} | Verify your email address</title>
</svelte:head>

<h1>Please verify your email address</h1>

{#if  $message}
   <h3>{message}</h3>
{/if}

<form method="post" use:enhance>
   <label class="label" for="code">Code:</label>
   <input type="text" 
      name="code"
      class="input"
      
      aria-invalid={$errors.code ? true : undefined}
      bind:value={$form.code}
      {...$constraints.code}
   />
   {#if $errors.code}
      <span class="invalid">{$errors.code}</span>
   {/if}
   <button type="submit" class="btn">Submit</button>
   {#if delayed}
      <ProgressRadial value={undefined} />
   {/if}
</form>