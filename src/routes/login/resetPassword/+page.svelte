<script lang="ts">
    import { superForm } from 'sveltekit-superforms';
    import type { PageData } from './$types';
    
    export let data: PageData;
    const { form, message, errors, constraints, enhance } = superForm(data.form);
</script>
{#if $message}
   <h3>{$message}</h3>
{/if}
<form method="post" use:enhance>
   <label for="email">Please enter your registered email address</label>
   <input type="email" name="email" 
      id="email" 
      class="input"
      bind:value={$form.email} 
      aria-invalid={$errors.email ? true : undefined} 
      {...$constraints.email} />
   {#if $errors.email}<span class="invalid">{$errors.email}</span>{/if}
   <button type="submit" class="btn">Reset password</button>
</form>