<script lang="ts">
   // @ts-ignore: it works
   import { PUBLIC_COMPANY_NAME } from '$env/static/public'
	import { superForm } from "sveltekit-superforms";
	import NameBlock from '$lib/userComponents/NameBlock.svelte';
	import Address from '$lib/userComponents/Address.svelte';
	import BasicUnitCustomer from '$lib/unitComponents/BasicUnitCustomer.svelte';
	
   // @ts-ignore: it works
   import type { PageData } from './$types';
	import { onMount } from 'svelte';
	import { getToastStore, type ToastSettings } from '@skeletonlabs/skeleton';
	export let data:PageData
	const { form, errors, constraints, message, enhance } = superForm(data.form);
   const toastStore = getToastStore();
   const newLease = data.newLease
   $: if(newLease){
      onMount(()=>{
         ( async () => {
            const toast: ToastSettings = {
               message: 'Please select a unit before setting up a lease',
               timeout: 4000,
            };
            toastStore.trigger(toast);
         })();
      });
   }
</script>

<svelte:head>
	<title>{PUBLIC_COMPANY_NAME} | Customer New Lease</title>
</svelte:head>

{#if $message}
<h3>{$message}</h3>
{/if}
{#if data.user}
<NameBlock nameBlock={data.user} />
{/if}
<form method="post" use:enhance>
{#if data.address}
   {#each data.address as address, index}
      <div class="flex">
         <Address address={address} />
         {#if index === 0}
            <input type="radio" name="contactInfoId" id={address.contactId} value={address.contactId} checked class="radio"/>
         {:else}
            <input type="radio" name="contactInfoId" id={address.contactId} value={address.contactId} class="radio"/>
         {/if}

      </div>
      {#if data.user?.organizationName}
         <div>
            <label for="orgainzation">This unit is being rented by an organization (Company, Non Profit, ect)
               <input type="checkbox" name="organization" id="organization" checked />
            </label>
         </div>
      {/if}
   {/each}
   
{:else}
   <a class="a" href="/register/addressFrom">Please add your address</a>
{/if}
{#if data.unit }
   <BasicUnitCustomer unit={data.unit} />
{/if}

{#if data.user && data.address }
   <input type="hidden" name="unitNum" id="unitNum" value={data.unit?.num} />
   <button class="btn">All the above is correct pay deposit</button>
{/if}
</form>