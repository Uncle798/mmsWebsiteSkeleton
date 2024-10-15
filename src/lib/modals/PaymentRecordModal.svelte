<script lang="ts">
   import { getModalStore } from "@skeletonlabs/skeleton";
   import { superForm } from "sveltekit-superforms";
   import { page } from "$app/stores";
   import type { SvelteComponent } from "svelte";

   export let parent:SvelteComponent;
   const modalStore = getModalStore();
   const {form, errors, constraints, message, enhance} = superForm($page.data.form, {
      onUpdate(event) {
         if(!message){
            modalStore.close();
         }
      },
      onError(event) {
         console.error(event.result);
      },
   })
   function onClose(){
      modalStore.close();
   }
</script>

{#if $modalStore[0]}
   <div class="card p-4 w-modal shadow-xl space-y-4">
      {#if $message}
       <h1 class="h1">{$message}</h1>
      {/if}
      <header class="text-2xl font-bold">{$modalStore[0].title ?? 'Title missing'}</header>
      <article>{$modalStore[0].body ?? 'Body missing'}</article>
      <form method="post" use:enhance>
         <label for="paymentAmount">Payment Amount
            <input type="number" name="paymentAmount" id="paymentAmount" bind:value={$form.paymentAmount} {...$constraints.paymentAmount} />
            {#if $errors.paymentAmount}
            {$errors.paymentAmount}
            {/if}
         </label>
         <label for="payee">Payee (if different than customer)
            <input type="text" name="payee" id="payee" class="input" bind:value={$form.payee} {...$constraints.payee} />
            {#if $errors.payee}
            {$errors.payee}
            {/if}
         </label>
         <label for="paymentNotes">Payment Notes
            <input type="text" name="paymentNotes" class="input" bind:value={$form.paymentNotes}>
         </label>
         <div>
            <label for="unitNum">Unit number
               <input type="text" class="input" name="unitNum">
            </label>
         </div>
         <div>
            <label for="paymentType">Payment Type
               <select name="paymentType" id="paymentType" class="select" bind:value={$form.paymentType}>
                  <option value="CHECK">Check</option>
                  <option value="CASH">Cash</option>
               </select>
            </label>
         </div>
         <button class="btn">Make payment Record</button>
         <button class="btn {parent.buttonNeutral}" on:click={onClose}>{parent.buttonTextCancel}</button>
      </form>
   </div>
{/if}