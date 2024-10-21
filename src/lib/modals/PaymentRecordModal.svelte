<script lang="ts">
   import { getModalStore } from "@skeletonlabs/skeleton";
   import { superForm } from "sveltekit-superforms";
   import { page } from "$app/stores";
   import { onMount, type SvelteComponent } from "svelte";
	import type { Invoice, Lease } from "@prisma/client";
	import type { PartialUser } from "$lib/server/partialTypes";

   export let parent:SvelteComponent;
   const modalStore = getModalStore();
   const customer:PartialUser = $modalStore[0].meta.customer
   const invoice:Invoice = $modalStore[0].meta.invoice;
   const customerLeases:Lease[] = $modalStore[0].meta.customerLeases
   let customerId:string;
   let invoiceId:string;
   let unitNum:string;
   const {form, errors, constraints, message, enhance} = superForm($page.data.newPaymentForm, {
      onUpdate(event) {
         if(!$message){
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
   onMount(() =>{
      customerId = customer.id;
      $form.paymentAmount = invoice.invoiceAmount;
      $form.paymentNotes = `Payment for invoice:${invoice.invoiceNum}\n "${invoice.invoiceNotes}"`
      unitNum = customerLeases[0].unitNum
      $form.unitNum = unitNum
      invoiceId = invoice.invoiceId
   })
</script>

{#if $modalStore[0]}
   <div class="card p-4 w-modal shadow-xl space-y-4">
      {#if $message}
       <h1 class="h1">{$message}</h1>
      {/if}
      <header class="text-2xl font-bold">{$modalStore[0].title ?? 'Title missing'}</header>
      <article>{$modalStore[0].body ?? 'Body missing'}</article>
      <form method="post" action=/paymentRecord/newPaymentRecord class="modal-form border border-surface-500 p-4 space-y-4 rounded-container-token" use:enhance>
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
               <input type="text" class="input" name="unitNum" bind:value={$form.unitNum}>
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
         <input type="hidden" name="customerId" id="customerId" bind:value={customerId}>
         <input type="hidden" name="invoiceId" id="invoiceId" bind:value={invoiceId}>
         <input type="hidden" name="unitNum" id="unitNum" bind:value={unitNum}>
         <button class="btn {parent.buttonPositive}">Make payment Record</button>
         <button class="btn {parent.buttonNeutral}" on:click={onClose}>{parent.buttonTextCancel}</button>
      </form>
   </div>
{/if}