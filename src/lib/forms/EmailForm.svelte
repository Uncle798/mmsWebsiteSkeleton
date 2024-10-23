<script lang="ts">
   import { superForm } from 'sveltekit-superforms';
   import { getToastStore, getModalStore } from '@skeletonlabs/skeleton';
	import type { ToastSettings } from '@skeletonlabs/skeleton';
   import type { SuperValidated, Infer } from 'sveltekit-superforms/client';
   import type { EmailFormSchema } from '$lib/formSchemas/schemas';
	import TextInput from '$lib/formComponents/TextInput.svelte';
	import EmailInput from '$lib/formComponents/EmailInput.svelte';

   interface Props {
      data: SuperValidated<Infer<EmailFormSchema>>;
   }

   let { data }: Props = $props();
   const modalStore = getModalStore();
   const toastStore = getToastStore();
   const { form, errors, constraints, message, enhance } = superForm(data, {
      onUpdate(event) {
         if(event.result.type === 'success'){
            const toast:ToastSettings = {
               message: 'Email Successfully Updated',
					timeout: 3000,
					background: 'variant-filled-success'
				}
				toastStore.trigger(toast);
			}
         if($modalStore[0]){
            if(!$message){
               modalStore.close();
            }
         }
      },
      onError(event) {
         console.error(event.result);
      },
   })
</script>
<form method="post" action="/register/email" class="modal-form border border-surface-500 p-4 space-y-4 rounded-container-token" use:enhance>
   <div class="flex">
      <EmailInput
         value={$form.email}
         name="email"
         label="Email"
         errors={$errors.email}
         constraints={$constraints.email}
      />
      <EmailInput
         value={$form.emailConfirm}
         name="confirmEmail"
         label="Confirm email"
         errors={$errors.emailConfirm}
         constraints={$constraints.emailConfirm}
      />
   </div>
   <button class="btn">Submit</button>
</form>