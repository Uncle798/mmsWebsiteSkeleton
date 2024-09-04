<script lang="ts">
   import { PUBLIC_COMPANY_NAME } from '$env/static/public'
   import { superForm } from 'sveltekit-superforms';
   import type { PageData } from './$types';
   
   export let data: PageData;
   const { form, errors, constraints, message, enhance } = superForm(data.form);
</script>

<svelte:head>
	<title>{PUBLIC_COMPANY_NAME} | Verify your email address</title>
</svelte:head>

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
</form>