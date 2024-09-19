<script lang="ts">
	import { getModalStore } from "@skeletonlabs/skeleton";
   import { superForm } from "sveltekit-superforms";
   import {SvelteComponent } from 'svelte';
   import { page } from "$app/stores";
	import { invalidateAll } from "$app/navigation";

   export let parent: SvelteComponent;
   const modalStore = getModalStore();
   const { form, errors, constraints, message, enhance } = superForm($page.data.confirmForm,{
      onUpdate(event) {
         invalidateAll();
         if(!$message){
            modalStore.close();
         }
      },
      onError(event){
         console.error(event.result);
      },
      onSubmit({formData}) {
         console.log(formData);
      },
   });
   function onClose(){
      modalStore.close();
   }
   
</script>

{#if $modalStore[0]}
   <div class="card p-4 w-modal shadow-xl space-y-4">
      {#if $message}
      <h1 class="h1">{$message}</h1>
     {/if}
     <header class="h3">{$modalStore[0].title ?? 'Title missing'}</header>
     <article>{$modalStore[0].body ?? 'Body missing'}</article>
   
      <form method="post" class="modal-form border space-y-4 rounded-container-token" use:enhance>
         <input type="hidden" name="leaseId" id="leaseId" value={$modalStore[0].meta.leaseId} {...$constraints.leaseId}>
         <input type="hidden" name="customerId" id="customerId" value={$modalStore[0].meta.customerId} {...$constraints.customerId}>
         <button class="btn {parent.buttonPositive}">End Lease</button>
         <button class="btn {parent.buttonNeutral}" on:click={onClose}>{parent.buttonTextCancel}</button>
      </form>
   </div>
{/if}