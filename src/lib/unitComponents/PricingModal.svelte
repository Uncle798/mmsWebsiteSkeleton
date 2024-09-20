<script lang="ts">
	import { getModalStore } from "@skeletonlabs/skeleton";
   import { superForm } from "sveltekit-superforms";
   import {SvelteComponent } from 'svelte';
   import { page } from "$app/stores";

   export let parent: SvelteComponent;
   const modalStore = getModalStore();
   const { form, errors, constraints, message, enhance } = superForm($page.data.pricingForm, {
      onUpdate(event) {
         if(!$message){
            modalStore.close();
         }
      },
      onError(event){
         console.error(event.result);
      },
      onSubmit({formData}) {
         
      },
      resetForm: true,
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
         <label for="size" class="lable">Select a size

         </label>
         <label for="price" class="lable">Enter a price: (must be whole number)
            $<input type="text" name="price" id="price" class="input" bind:value={$form.price}>
         </label>
         <button class="btn {parent.buttonPositive}">Submit</button>
         <button class="btn {parent.buttonNeutral}" on:click={onClose}>{parent.buttonTextCancel}</button>
      </form>
   </div>
{/if}