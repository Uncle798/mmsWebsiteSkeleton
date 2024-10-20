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
   const { unit, addresses } = data
</script>

<svelte:head>
	<title>{PUBLIC_COMPANY_NAME} | Customer New Lease</title>
</svelte:head>

{#if $message}
   <h3 class="h3">{$message}</h3>
{/if}
{#if data.user?.givenName}
   <NameBlock nameBlock={data.user} />
   {:else}
   <button class="btn">Tell us your name</button>
{/if}
<form method="post" use:enhance>
   {#if addresses}
      {#each addresses as address, index}
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
      <a class="a" href="/register/addressForm?unitNum={unit?.num}">Please add your address</a>
   {/if}
   {#if unit }
      <BasicUnitCustomer unit={unit} />
      <input type="hidden" name="unitNum" id="unitNum" bind:value={unit.num}>
   {/if}

   {#if data.user && data.addresses  }
      <button class="btn">All the above is correct pay deposit</button>
   {/if}
</form>