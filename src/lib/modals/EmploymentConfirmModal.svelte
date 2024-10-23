<script lang="ts">
   import { getModalStore, SlideToggle } from "@skeletonlabs/skeleton";
   import { superForm } from "sveltekit-superforms";
   import { page } from "$app/stores";
   import type { SvelteComponent } from "svelte";
	import { invalidateAll } from "$app/navigation";
   
   interface Props {
      parent: SvelteComponent;
   }

   let { parent }: Props = $props();
   const modalStore = getModalStore();
   const { form:employeeForm, errors:employeeErrors, constraints, message:employeeMessage, formId, enhance } = superForm($page.data.employeeForm,{
      onUpdate(event) {
         if(!$employeeMessage){
            modalStore.close();
         }
      },
      onError(event) {
         console.error(event.result);
      },
      onSubmit({formData}){
         formData.set('userId', $modalStore[0].meta.userId);
      },
      resetForm: true,
   });
   function onClose(){
      modalStore.close();
   }
</script>

{#if $modalStore[0]}
<div class="card p-4 w-modal shadow-xl space-y-4">
      {#if $employeeMessage}
       <h1 class="h1">{$employeeMessage}</h1>
      {/if}
      <header class="text-2xl font-bold">{$modalStore[0].title ?? 'Title missing'}</header>
      <article>{$modalStore[0].body ?? 'Body missing'}</article>
      
      <form method="post" action=?/changeEmployeeStatus class="modal-form border border-surface-500 p-4 space-y-4 rounded-container-token" use:enhance>
         <SlideToggle name='employee' checked={$modalStore[0].meta.employee} >Employee </SlideToggle>
         <SlideToggle name='admin' checked={$modalStore[0].meta.admin} >Admin </SlideToggle>
         <input type="hidden" name="userId" id="userId" value={$modalStore[0].meta.userId} {...$constraints.userId}/>
         <button class="btn {parent.buttonPositive}">Submit</button>
         <button class="btn {parent.buttonNeutral}" onclick={onClose}>{parent.buttonTextCancel}</button>
      </form>
   </div>
{/if}