<script lang="ts">
   // @ts-ignore: it works
   import { PUBLIC_COMPANY_NAME } from '$env/static/public'
   import BasicLease from '$lib/leaseComponents/BasicLease.svelte';
   import Address from '$lib/userComponents/Address.svelte';
   import NameBlock from '$lib/userComponents/NameBlock.svelte';
	import type { PageData } from './$types';
	import { getModalStore } from '@skeletonlabs/skeleton';
   import type { ModalComponent, ModalSettings } from '@skeletonlabs/skeleton';
	import AddressFormModal from '$lib/modals/AddressFormModal.svelte';
   import NameFormModal from '$lib/modals/NameFormModal.svelte';
	import PasswordFormModal from '$lib/modals/PasswordFormModal.svelte';
	import EmailFormModal from '$lib/modals/EmailFormModal.svelte';
	import BasicInvoice from '$lib/leaseComponents/BasicInvoice.svelte';

   interface Props {
      data: PageData;
   }

   let { data }: Props = $props();
   export const { contactInfo,  leases, dbUser, invoices, payments } = data;
   const modalStore = getModalStore();
   function addressModal(title:string){
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
    function nameModal(title: string){
      const modalComponent:ModalComponent = {
         ref: NameFormModal
      }
      const modal:ModalSettings = {
         type: 'component',
         component: modalComponent,
         title, 
         body: 'Please enter your name'
      }
      modalStore.trigger(modal);
    }
    function passwordModal(title:string){
      const modalComponent:ModalComponent={
         ref: PasswordFormModal
      };
      const modal:ModalSettings ={
         type: 'component',
         component: modalComponent,
         title,
         body: 'Please enter a new password'
      }
      modalStore.trigger(modal);
    }
    function emailModal(title:string){
      const modalComponent:ModalComponent={
         ref: EmailFormModal
      };
      const modal:ModalSettings ={
         type: 'component',
         component: modalComponent,
         title,
         body: 'Please enter a new email address'
      }
      modalStore.trigger(modal);
    }
</script>

<svelte:head>
	<title>User: {dbUser?.givenName} {dbUser?.familyName}</title>
</svelte:head>
{#if dbUser?.id === data.user?.id}
   {#if dbUser}
      <NameBlock nameBlock={dbUser} />
      <button class="btn" onclick={()=>{nameModal('Please update your name')}}>Update your name</button>
      <button class="btn" onclick={()=>{emailModal('Please update your email')}}>Update your email</button>
   {/if}
   {#if contactInfo} 
      <Address address={contactInfo}/>
      <button class="btn" onclick={()=>{addressModal('Please update your address')}}>Change Address</button>
   {:else}
      <button class="btn" onclick={()=>{addressModal('Please add your address')}} >Add your Address</button>
   {/if}
      <button class="btn " onclick={()=>{passwordModal('Please enter a new password')}}>Change your password</button>
   {#if leases}
      {#each leases as lease}   
         <BasicLease lease={lease} />
      {/each}
   {/if}
{/if}
{#if data.user?.employee}
   {#if dbUser}
      <NameBlock nameBlock={dbUser} />
   {/if}
   {#if leases}      
      {#each leases as lease}
         <BasicLease lease={lease} />
      {/each}
   {/if}
   {#if invoices}
      {#each invoices as invoice}
         <BasicInvoice invoice={invoice} />
      {/each}
   {/if}
{/if}