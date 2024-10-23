<script lang="ts">
    import { superForm } from 'sveltekit-superforms';
    import type { PageData } from './$types';
    
   interface Props {
      data: PageData;
   }

   let { data }: Props = $props();
    const { form, message, errors, constraints, enhance } = superForm(data.form);
</script>
{#if $message}
   <h3>{$message}</h3>
{/if}
<form method="post" use:enhance>
   <label for="password">Please enter a new password</label>
   <input type="password" name="password" id="password" 
   class="input"
   bind:value={$form.password} 
   aria-invalid={$errors.password ? true : undefined} 
   {...$constraints.password} />
   {#if $errors.password}<span class="invalid">{$errors.password}</span>{/if}
   <label for="password">Please confirm your new password</label>
   <input type="password" name="passwordConfirm" id="passwordConfirm"
      class="input"
      bind:value={$form.passwordConfirm} 
      aria-invalid={$errors.passwordConfirm ? true : undefined} 
      {...$constraints.passwordConfirm} />
   {#if $errors.passwordConfirm}<span class="invalid">{$errors.passwordConfirm}</span>{/if}
   <p>
        <button type="submit" class="btn">Reset password</button>
   </p>
</form>