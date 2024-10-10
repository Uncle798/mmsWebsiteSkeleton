<script lang="ts">
   import { PUBLIC_COMPANY_NAME } from '$env/static/public'
   import { error } from '@sveltejs/kit';
   import { superForm } from 'sveltekit-superforms'
   import type { PageData } from './$types';
   import { Autocomplete } from '@skeletonlabs/skeleton';
   import type { AutocompleteOption } from '@skeletonlabs/skeleton';
   import type { ContactInfo, Invoice } from '@prisma/client';
   import type { PartialUser } from '$lib/server/partialTypes';
	import Address from '$lib/userComponents/Address.svelte';
	import BasicInvoice from '$lib/leaseComponents/BasicInvoice.svelte';
    
   export let data: PageData;
   const {form, errors, constraints, message, enhance} = superForm(data.form, {
      onSubmit(input) {
         console.log($form);
      },
   });
   const customers = data.customers;
   const invoices = data.invoices;
   const addresses = data.addresses;
   let customerSearch:string | undefined = '';
   let customerAddress:ContactInfo[]=[];
   let customerInvoices: Invoice[] =[];
   let currentInvoice: Invoice | undefined;
   let customer:PartialUser | undefined;
   let invoiceSearch: string | undefined = '';
   let invoiceOptions: AutocompleteOption<string>[] =[];
   let customerOptions: AutocompleteOption<string>[] = [];
   customers.forEach((customer)=> {
      const customerInvoices = invoices.filter((i) => i.customerId === customer.id);
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
      const userAddresses = addresses.filter((address) => address.userId === event.detail.value);
      userAddresses.forEach((address) =>{
         customerAddress.push(address);
      });
      customer = customers.find((user) => user.id === event.detail.value);
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
            keywords: `${i.invoiceNotes} ${i.invoiceAmount} ${i.invoiceId}`
         }
         invoiceOptions = [ ...invoiceOptions, option];
      })
      $form.customerId = event.detail.value;
   };
   function onInvoiceSearch(event: CustomEvent<AutocompleteOption<string>>):void {
      invoiceSearch = event.detail.label;
      currentInvoice = customerInvoices.find((invoice) => invoice.invoiceId === event.detail.value);
      $form.invoiceId = event.detail.value;
      $form.paymentAmount = currentInvoice!.invoiceAmount;
   }
</script>

<div>
   <form method="post" use:enhance>
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
         <label for="paymentAmount">Payment Amount
            <input type="number" name="paymentAmount" id="paymentAmount" bind:value={$form.paymentAmount} {...$constraints.paymentAmount} />
            {#if $errors.paymentAmount}
            {$errors.paymentAmount}
            {/if}
         </label>
         <label for="payee">Payee (if different than customer)
            <input type="text" name="payee" id="payee" bind:value={$form.payee} {...$constraints.payee} />
            {#if $errors.payee}
            {$errors.payee}
            {/if}
         </label>
         <div>
            <label for="paymentType">Payment Type
               <select name="paymentType" id="paymentType" class="select" bind:value={$form.paymentType}>
                  <option value="STRIPE">Stripe</option>
                  <option value="CASH">Cash</option>
                  <option value="CHECK">Check</option>
               </select>
            </label>
         </div>
      </div>
      {/if}
      {#if customerInvoices.length > 0 }
      {#each customerInvoices as invoice}
      <div>
         <BasicInvoice invoice={invoice} />
      </div>
         {/each}
         <button class="btn">Make payment Record</button>
      {/if}
   </form>
</div>