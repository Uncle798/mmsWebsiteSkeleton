<script lang="ts">
   import { PUBLIC_COMPANY_NAME } from '$env/static/public'
   import { error } from '@sveltejs/kit';
   import { superForm } from 'sveltekit-superforms'
   import { Autocomplete } from '@skeletonlabs/skeleton';
	import BasicLease from '$lib/leaseComponents/BasicLease.svelte';
	import Address from '$lib/userComponents/Address.svelte';
   import type { AutocompleteOption } from '@skeletonlabs/skeleton';
	import type { ContactInfo, Lease } from '@prisma/client';
   import type { PageData } from './$types';
	import type { PartialUser } from '$lib/server/partialTypes';
   export let data: PageData;
   const customers = data.customers;
   const leases = data.leases;
   const addresses = data.addresses
   const {form, errors, constraints, message, enhance} = superForm(data.form);

   let customerSearch = '';
   let unitSearch = '';
   let customerAddress:ContactInfo[]=[];
   let customerLease:Lease;
   let customer:PartialUser;
   let selected = false;
   let customerOptions: AutocompleteOption<string>[] = [];
   customers.forEach((customer)=> {
      const lease = leases.find((lease) => lease.customerId === customer.id);
      const option:AutocompleteOption<string> = {
         label: `${customer.familyName}, ${customer.givenName}`,
         value: customer.id,
         keywords: `${customer.email}, ${customer.organizationName} ${lease?.unitNum}`,
         meta: {leaseId: lease?.leaseId, unitNum: lease?.unitNum }
      }
      customerOptions.push(option);
   });
   function onCustomerSearch(event: CustomEvent<AutocompleteOption<string>>): void {
      customerAddress.forEach(() =>{
         customerAddress.pop();
      })
      customerSearch = event.detail.label;
      unitSearch = event.detail.meta.unitNum;
      const userAddresses = addresses.filter((address) => address.userId === event.detail.value);
      userAddresses.forEach((address) =>{
         customerAddress.push(address);
      });
      customerAddress.forEach((address) =>{
         console.log(address);
      })
      customerLease = leases.find((lease) => lease.customerId === event.detail.value);
      customer = customers.find((user) => user.id === event.detail.value);
      selected= true;
   };
   let unitOptions: AutocompleteOption<string>[] = [];
   data.units.forEach((unit) =>{
      const lease = leases.find((l) => l.unitNum === unit.num);
      customer = customers.find((c) => c.id === lease?.customerId);
      const option:AutocompleteOption<string> = {
         label: unit.num.replace(/^0+/gm,''),
         value: unit.num,
         keywords: `${customer?.familyName}, ${customer?.givenName}`,
         meta: {leaseId: lease?.leaseId}
      }
      unitOptions.push(option);
   })
   function onUnitSearch(event:CustomEvent<AutocompleteOption<string>>):void {
      customerAddress.forEach(() =>{
         customerAddress.pop();
      })
      unitSearch = event.detail.label;
      customerSearch = event.detail.keywords;
      const lease = leases.find((l) => l.unitNum === event.detail.value);
      customer = customers.find((c) => c.id === lease?.customerId);
      const userAddresses = addresses.filter((address) => address.userId === customer.id);
      userAddresses.forEach((address) =>{
         customerAddress.push(address);
      });
      customerLease = leases.find((lease) => lease.customerId === event.detail.value);
      customer = customers.find((user) => user.id === event.detail.value);
      selected= true;
   }
</script>
<div class="card">
   <div class="card float-start">
      <label for="customerSearch">Customers
         <input type="search" class="input" name="customerSearch" id="customerSearch" bind:value={customerSearch} placeholder="Customer search ..." />
         <Autocomplete bind:input={customerSearch} options={customerOptions} on:selection={onCustomerSearch} />
      </label>
   </div>
   <div class="card float-left">
      <label for="unitsSearch">Unit
         
         <input type="search" class="input" name="unitSearch" id="unitSearch" bind:value={unitSearch} placeholder="Unit Search" />
         <Autocomplete bind:input={unitSearch} options={unitOptions} on:selection={onUnitSearch} />
      </label>
   </div>
   {#if selected}
      {#if $message}
         {$message}
      {/if}
      {#each customerAddress as address}
      <Address address={address} />
      {/each}
      <BasicLease lease = {customerLease} customer={customer} />
      <form method="post" use:enhance>
         <label for="notes">Notes
            <input type="text" name="notes" id="notes" class="input" bind:value={$form.notes} {...$constraints.notes}/>
         </label>
         <input type="hidden" name="invoiceAmount" id="invoiceAmount" value={customerLease.price} />
         <input type="hidden" name="leaseId" id="leaseId" value={customerLease.leaseId} />
         <input type="hidden" name="customerId" id="customerId" value={customer.id} />
            {$errors.customerId}
            {$errors.leaseId}
            {$errors.notes}
            {$errors.invoiceAmount}
            {$errors._errors}
         <button class="btn">Create invoice for this lease</button>
      </form>
   {/if}
</div>