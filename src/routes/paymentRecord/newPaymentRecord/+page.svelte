<script lang="ts">
   import { PUBLIC_COMPANY_NAME } from '$env/static/public'
   import { error } from '@sveltejs/kit';
   import { superForm } from 'sveltekit-superforms'
   import type { PageData } from './$types';
   import { Autocomplete } from '@skeletonlabs/skeleton';
   import type { AutocompleteOption } from '@skeletonlabs/skeleton';
   import type { ContactInfo, Invoice, Lease } from '@prisma/client';
   import type { PartialUser } from '$lib/server/partialTypes';
	import Address from '$lib/userComponents/Address.svelte';
	import BasicInvoice from '$lib/leaseComponents/BasicInvoice.svelte';
    
   interface Props {
      data: PageData;
   }

   let { data }: Props = $props();
   const {form, errors, constraints, message, enhance} = superForm(data.form, {
      onError(event) {
         console.error(event.result);
      },
      dataType: 'json'
   });
   const { customers, invoices, addresses, leases } = data;
   let customerSearch:string | undefined = $state('');
   let customerAddress:ContactInfo[] = [];
   let customerInvoices: Invoice[] = $state([]);
   let customerLeases: Lease[] = $state([]);
   let currentInvoice: Invoice | undefined;
   let customer:PartialUser | undefined;
   let invoiceSearch: string | undefined = $state('');
   let invoiceOptions: AutocompleteOption<string>[] =$state([]);
   let customerOptions: AutocompleteOption<string>[] = [];
   customers.forEach((customer)=> {
      const customerInvoices = invoices.filter((i) => i.customerId === customer.id);
      const customerLeases = leases.filter((l) => l.customerId === customer.id);
      const option:AutocompleteOption<string> = {
         label: `${customer.familyName}, ${customer.givenName}`,
         value: customer.id,
         keywords: `${customer.email}, ${customer.organizationName}`,
      }
      customerOptions.push(option);
   });
   function onCustomerSearch(event: CustomEvent<AutocompleteOption<string>>): void {
      customerAddress.length = 0;
      customerSearch = event.detail.label;
      const customerId = event.detail.value
      const userAddresses = addresses.filter((address) => address.userId === customerId);
      customerLeases = leases.filter((lease) => lease.customerId === customerId);
      userAddresses.forEach((address) =>{
         customerAddress.push(address);
      });
      customer = customers.find((user) => user.id === customerId);
      customerInvoices.length = 0;
      const currentInvoices = invoices.filter((i) => i.customerId === customer?.id);
      currentInvoices.forEach((cI) =>{
         customerInvoices.push(cI)
      })
      invoiceOptions.length = 0;
      currentInvoices.forEach((i) =>{
         const option:AutocompleteOption<string> ={
            label: String(i.invoiceNotes),
            value: i.invoiceId,
            keywords: `${i.invoiceNotes} ${i.invoiceNum} ${i.invoiceId}`
         }
         invoiceOptions = [ ...invoiceOptions, option];
      })
      form.update(($form) =>{
         $form.customerId = customerId;
         return $form;
      },
      { taint: false}
      );
      
   };
   function onInvoiceSearch(event: CustomEvent<AutocompleteOption<string>>):void {
      invoiceSearch = event.detail.label;
      currentInvoice = customerInvoices.find((invoice) => invoice.invoiceId === event.detail.value);
      form.update(($form) =>{
         $form.invoiceId = event.detail.value;
         $form.paymentAmount = currentInvoice!.invoiceAmount;
         $form.paymentNotes = `Payment for invoice:${currentInvoice?.invoiceNum}\n "${currentInvoice?.invoiceNotes}""`
         $form.unitNum = customerLeases[0].unitNum
         return $form;
      },
      { taint: false}
      );
      
   }
</script>

<div>
   <div class="card float-start">
      <label for="customerSearch">Customers
         <input type="search" class="input" name="customerSearch" id="customerSearch" bind:value={customerSearch} placeholder="Customer search ..." />
         <Autocomplete bind:input={customerSearch} options={customerOptions} on:selection={onCustomerSearch} />
      </label>
   </div>
   {#if invoiceOptions.length > 0}
   
   <div class="card float-left">
      <input type="search" name="invoiceSearch" id="invoiceSearch" class="input" bind:value={invoiceSearch} />
      <Autocomplete bind:input={invoiceSearch} options={invoiceOptions} on:selection = {onInvoiceSearch} />
   </div>
   <div class="card float-left">
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
                  <select name="unitNum" id="unitNum" class="select" bind:value={$form.unitNum}>
                     {#each customerLeases as lease}
                           <option value={lease.unitNum}>{lease.unitNum.replace(/^0+/gm,'')}</option>
                     {/each}
                  </select>
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
         </form>  
      </div>
      {/if}
      {#if customerInvoices.length > 0 }
      {#each customerInvoices as invoice}
      <div>
         <BasicInvoice invoice={invoice} />
      </div>
         {/each}
      {/if}
</div>