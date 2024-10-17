<script lang="ts">
   import { superForm } from 'sveltekit-superforms';
   import type { SuperValidated, Infer } from 'sveltekit-superforms/client';
   import type { NameFormSchema } from '$lib/formSchemas/schemas';
	import TextInput from '$lib/formComponents/TextInput.svelte';

   export let data: SuperValidated<Infer<NameFormSchema>>;
   const { form, errors, constraints, message, enhance } = superForm(data, {
      onUpdate(event) {
      },
      onError(event) {
         console.error(event.result);
      },
   })
</script>

{#if $message}
   {$message}
{/if}
<form method="post" action="/register/name" class="modal-form border border-surface-500 p-4 space-y-4 rounded-container-token" use:enhance>
   <div class="flex">
      <TextInput
         name="givenName"
         label="Given Name"
         bind:value={$form.givenName}
         errors={$errors.givenName}
         constraints={$constraints.givenName}
         placeholder="Smokey"
         />
      <TextInput
         name="familyName"
         label="Family Name"
         bind:value={$form.familyName}
         errors={$errors.familyName}
         constraints={$constraints.familyName}
         placeholder="Bear"
         />
   </div>
</form>