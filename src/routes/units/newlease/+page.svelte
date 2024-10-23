<script lang="ts">
   // @ts-ignore: it works
   import { PUBLIC_COMPANY_NAME } from '$env/static/public'
	import { superForm } from "sveltekit-superforms";
	import NameBlock from '$lib/userComponents/NameBlock.svelte';
	import Address from '$lib/userComponents/Address.svelte';
	import BasicUnitCustomer from '$lib/unitComponents/BasicUnitCustomer.svelte';
   import AddressFormModal from '$lib/modals/AddressFormModal.svelte';
   import { getModalStore } from '@skeletonlabs/skeleton'
	import type { ModalComponent, ModalSettings } from '@skeletonlabs/skeleton'
   // @ts-ignore: it works
   import type { PageData } from './$types';
	import { onMount } from 'svelte';
	import { getToastStore, type ToastSettings } from '@skeletonlabs/skeleton';
	import NameFormModal from '$lib/modals/NameFormModal.svelte';
   interface Props {
      data: PageData;
   }

   let { data }: Props = $props();
	const { form, errors, constraints, message, enhance } = superForm(data.leaseForm);
   let { unit, address } = $state(data)
   const modalStore = getModalStore();
   function fireAddressModal(title:string){
       const modalComponent: ModalComponent = {
            ref: AddressFormModal
        }
        const modal:ModalSettings = {
            type: 'component',
            component: modalComponent,
            title, 
            body: `Please enter a new address`,
        }
        modalStore.trigger(modal);
    }
   function fireNameModal(title:string){
       const modalComponent: ModalComponent = {
            ref: NameFormModal
        }
        const modal:ModalSettings = {
            type: 'component',
            component: modalComponent,
            title, 
            body: `Please enter a new address`,
        }
        modalStore.trigger(modal);
    }
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
   <button class="btn" onclick={()=>{fireNameModal('Tell us your name')}}>Tell us your name</button>
{/if}
      
<form method="post" use:enhance>
   {#if address}
      <Address address={address} />
      {#if data.user?.organizationName}
         <div>
            <label for="orgainzation">This unit is being rented by an organization (Company, Non Profit, ect)
               <input type="checkbox" name="organization" id="organization" checked />
            </label>
         </div>
      {/if}
         <button class="btn" onclick={()=>{fireAddressModal('Please update your address')}}>Update address</button>
   {:else}
      <button class="btn" onclick={()=>{fireAddressModal('Please add your address')}}>Please add your address</button>
   {/if}
   {#if unit }
      <BasicUnitCustomer unit={unit} />
      <input type="hidden" name="unitNum" id="unitNum" bind:value={unit.num}>
   {/if}

   {#if data.user && data.address  }
      <button class="btn">All the above is correct pay deposit</button>
   {/if}
</form>