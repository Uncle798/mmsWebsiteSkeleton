<script lang="ts">
	import { getModalStore, SlideToggle } from "@skeletonlabs/skeleton";
   import { superForm } from "sveltekit-superforms";
   import {SvelteComponent } from 'svelte';
   import { page } from "$app/stores";

  interface Props {
    parent: SvelteComponent;
  }

  let { parent }: Props = $props();
   const modalStore = getModalStore();
   const { form, errors, constraints, message, enhance } = superForm($page.data.form, {
      onUpdate(event) {
         if(!$message){
            // modalStore.close();
         }
         
      },
      onError(event){
         console.error(event.result);
      },
      onSubmit({formData}) {
         
      },
      resetForm: true,
   });
   function cancel(){
      modalStore.close();
   }
   
</script>

{#if $modalStore[0]}
   <div class="card p-4 w-modal shadow-xl space-y-4">
      {#if $message}
      <p class="h2">{$message}</p>
     {/if}
     <header class="h3">{$modalStore[0].title ?? 'Title missing'}</header>
     <article>{$modalStore[0].body ?? 'Body missing'}</article>
      <form method="post" action="?/changePrice" class="modal-form border space-y-4 rounded-container-token" use:enhance>
         <label for="size" class="lable">Select a size
            <select class="select" name="size">
               {#each $page.data.sizesPrices as size}
                  <option value="{size.size}" >{size.size.replace(/^0+/gm, '').replace(/x0/gm, 'x')}, currently: ${size.price}</option>
               {/each}
            </select>
         </label>
         <label for="price" class="lable">Enter a price: (must be whole number)
            $<input type="text" name="price" id="price" class="input" bind:value={$form.price}>
         </label>
         <SlideToggle name="lowerPrice" bind:checked={$form.lowerPrice} >Lower Price</SlideToggle>
  
         <button class="btn {parent.buttonPositive}">Submit</button>
         <button class="btn {parent.buttonNeutral}" onclick={cancel}>{parent.buttonTextCancel}</button>
      </form>
   </div>
{/if}