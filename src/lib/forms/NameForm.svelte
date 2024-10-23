<script lang="ts">
   import { superForm } from 'sveltekit-superforms';
   import { getToastStore, ProgressRadial } from '@skeletonlabs/skeleton'
   import type { ToastSettings } from '@skeletonlabs/skeleton'
   import type { SuperValidated, Infer } from 'sveltekit-superforms/client';
   import type { NameFormSchema } from '$lib/formSchemas/schemas';
	import TextInput from '$lib/formComponents/TextInput.svelte';
	import { getModalStore } from '@skeletonlabs/skeleton';

   export let data: SuperValidated<Infer<NameFormSchema>>;
   export let finished=false;
   const modalStore = getModalStore();
   const toastStore = getToastStore();
   const { form, errors, constraints, message, delayed, timeout, enhance } = superForm(data, {
      onUpdate(event) {
         if($modalStore[0]){
            modalStore.close();
         }
         if(event.result.type === 'success'){
            finished = true
				const toast:ToastSettings = {
					message: 'Name Successfully Updated',
					timeout: 3000,
					background: 'variant-filled-success'
				}
				toastStore.trigger(toast);
			}
      },
      onError(event) {
         console.error(event.result);
      },
      delayMs: 300,
      timeoutMs: 8000,
   })
   function close(){
      modalStore.close();
   }
</script>

{#if $message}
   {$message}
{/if}
<form method="post" action="/register/name" class=" p-4 space-y-4 rounded-container-token" use:enhance>
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
   <div class="flex">
      <button class="btn">Submit</button>
      {#if $modalStore[0]}
      <button class="btn" on:click={close}>Cancel</button>
      {/if}
      {#if $delayed}
         <ProgressRadial value={undefined} font={12} width='w-10' stroke={100} meter="stroke-primary-500" track="stroke-primary-500/20" strokeLinecap="butt"  />
      {/if}
   </div>
</form>