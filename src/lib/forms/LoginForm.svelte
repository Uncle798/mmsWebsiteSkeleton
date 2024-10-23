<script lang="ts">
   import { superForm } from 'sveltekit-superforms';
	import { getToastStore } from '@skeletonlabs/skeleton';
	import type { ToastSettings } from '@skeletonlabs/skeleton';
   import type { SuperValidated, Infer } from 'sveltekit-superforms/client';
   import type { LoginSchema} from '$lib/formSchemas/schemas';
	import TextInput from '$lib/formComponents/TextInput.svelte';
	import { getModalStore } from '@skeletonlabs/skeleton';
	import PasswordInput from '$lib/formComponents/PasswordInput.svelte';

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
  <h3 class="h3">{$message}</h3> 
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
      <PasswordInput
         name="password"
         label="Password"
         value={$form.password}
         errors={$errors.password}
         constraints={$constraints.password}
         autocomplete="current-password"
      />
   </div>
   <button class="btn">Submit</button>
</form>