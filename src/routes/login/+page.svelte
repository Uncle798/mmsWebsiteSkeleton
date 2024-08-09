<script lang="ts">
   import { error } from '@sveltejs/kit';
   import { superForm } from 'sveltekit-superforms'
   import SuperDebug from 'sveltekit-superforms';
   export let data;
   const {form, errors, constraints, message, enhance} = superForm(data.form);
</script>
<SuperDebug data={$form}></SuperDebug>
{#if $message}
   {$message}
{/if}
<form method="POST" use:enhance>
   <label for="email">email</label>
   <input type="email"
      name="email" 
      aria-invalid={$errors.email ? 'true' : undefined } 
      bind:value={$form.email}
      {...$constraints.email}
   >
   {#if $errors.email}
      <span class="invalid">{$errors.email}</span>
   {/if}
   <label for="password">password</label>
   <input type="password" name="password" 
      id="password" 
      aria-invalid={$errors.password ? 'true' : undefined}
      bind:value={$form.password}
      {...$constraints.password}
   >
   {#if $errors.password}
      <span class="invalid">{$errors.password}</span>
   {/if}
   <button>Submit</button>
</form>

<a href="/login/github">Sign in with GitHub</a>