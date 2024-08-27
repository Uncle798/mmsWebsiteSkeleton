<script lang="ts">
   import { error } from '@sveltejs/kit';
   import { superForm } from 'sveltekit-superforms'
   export let data;
   const mess = data.mess
   const {form, errors, constraints, message, enhance} = superForm(data.form);
</script>

<svelte:head>
	<title>Moscow Mini Storage | Login</title>
</svelte:head>

{#if $message}
   {$message}
{:else if mess}
   {mess}
{/if}
<form method="POST" use:enhance>
   <label for="email">email</label>
   <input type="email"
      name="email"
      class="input" 
      aria-invalid={$errors.email ? 'true' : undefined } 
      bind:value={$form.email}
      {...$constraints.email}
   >
   {#if $errors.email}
      <span class="input-error">{$errors.email}</span>
   {/if}
   <label for="password">password</label>
   <input type="password" name="password" 
      id="password"
      class="input" 
      aria-invalid={$errors.password ? 'true' : undefined}
      bind:value={$form.password}
      {...$constraints.password}
   >
   {#if $errors.password}
      <span class="input-error">{$errors.password}</span>
   {/if}
   <button class="btn">Submit</button>
</form>

<a href="/login/resetPassword">Forgot your password?</a>