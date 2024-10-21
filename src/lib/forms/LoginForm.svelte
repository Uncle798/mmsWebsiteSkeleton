<script lang="ts">
   import { superForm } from 'sveltekit-superforms';
	import { getToastStore } from '@skeletonlabs/skeleton';
	import type { ToastSettings } from '@skeletonlabs/skeleton';
   import type { SuperValidated, Infer } from 'sveltekit-superforms/client';
   import type { LoginSchema} from '$lib/formSchemas/schemas';
	import TextInput from '$lib/formComponents/TextInput.svelte';
	import { getModalStore } from '@skeletonlabs/skeleton';

   export let data: SuperValidated<Infer<LoginSchema>>;
   const modalStore = getModalStore();
   const { form, errors, constraints, message, enhance } = superForm(data, {
      onUpdate(event) {
         if($modalStore[0]){
            modalStore.close();
         }
      },
      onError(event) {
         console.error(event.result);
      },
   })
</script>

{#if $message}
   {$message}
{/if}
<form method="post" action="/login" class="form" use:enhance>
   <div class="flex">
      <TextInput
         name="email"
         label="Email"
         bind:value={$form.email}
         errors={$errors.email}
         constraints={$constraints.email}
         placeholder="email@email.com"
         />
         <label for="password">password
         <input type="password" name="password" 
            id="password"
            class="input" 
            aria-invalid={$errors.password ? 'true' : undefined}
            bind:value={$form.password}
            {...$constraints.password}
            autocomplete="current-password"
            placeholder="Password"
         />
      </label>
         {#if $errors.password}
         <span class="input-error">{$errors.password}</span>
         {/if}
   </div>
   <button class="btn">Submit</button>
</form>