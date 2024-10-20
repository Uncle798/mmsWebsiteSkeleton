<script lang="ts">
   // @ts-ignore: it works
   import { PUBLIC_COMPANY_NAME } from '$env/static/public'
   import BasicLease from '$lib/leaseComponents/BasicLease.svelte';
   import Address from '$lib/userComponents/Address.svelte';
   import NameBlock from '$lib/userComponents/NameBlock.svelte';
   import Th from '$lib/tableComponent/Th.svelte'
   import ThFilter from "$lib/tableComponent/ThFilter.svelte";
   import Search from "$lib/tableComponent/Search.svelte";
   import RowsPerPage from "$lib/tableComponent/RowsPerPage.svelte";
	import Pagination from "$lib/tableComponent/Pagination.svelte"; 
	import { DataHandler } from '@vincjo/datatables';
	import type { PageData } from './$types';
	import { getModalStore } from '@skeletonlabs/skeleton';
   import type { ModalComponent, ModalSettings } from '@skeletonlabs/skeleton';
	import AddressFormModal from '$lib/modals/AddressFormModal.svelte';
   import NameFormModal from '$lib/modals/NameFormModal.svelte';
	import PasswordFormModal from '$lib/modals/PasswordFormModal.svelte';
	import EmailFormModal from '$lib/modals/EmailFormModal.svelte';

   export let data:PageData;
   export const { contactInfo,  leases, tableData } = data;
   $: dbUser = data.dbUser;
   const handler = new DataHandler(tableData, {rowsPerPage:  10});
   const rows = handler.getRows();
   const rowCount = handler.getRowCount();
   const paymentSum = handler.createCalculation('invoiceAmount').sum()
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
	<title>{PUBLIC_COMPANY_NAME} | User: {dbUser?.givenName} {dbUser?.familyName}</title>
</svelte:head>

{#if dbUser}
   <NameBlock nameBlock={dbUser} />
   <button class="btn" on:click={()=>{nameModal('Please update your name')}}>Update your name</button>
   <button class="btn" on:click={()=>{emailModal('Please update your email')}}>Update your email</button>
{/if}
{#if contactInfo}
{#if contactInfo.length > 0}
      
   {#each contactInfo as info}   
   <Address address={info}/>
   <button class="btn" on:click={()=>{addressModal('Please update your address')}}>Change Address</button>
   {/each}
   {/if}
   {:else}
   <button class="btn" on:click={()=>{addressModal('Please add your address')}} >Add your Address</button>
{/if}
   <button class="btn " on:click={()=>{passwordModal('Please enter a new password')}}>Change your password</button>
{#if leases}
   {#each leases as lease}   
      <BasicLease lease={lease} />
   {/each}
{/if}
{#if $rowCount.total > 0 }
   <header>
      <Search {handler} /> <RowsPerPage {handler} />
   </header>   
   <table class="table-container table-hover">
      <thead>
         <tr>
            <Th {handler}>Invoice Amount</Th>
            <Th {handler}>Invoice num</Th>
            <Th {handler}>Payment Completed</Th>
            <Th {handler}>Payment type</Th>
            <Th {handler}>Customer</Th>
         </tr>
         <tr>
            <ThFilter {handler} filterBy='invoiceAmount' />
            <ThFilter {handler} filterBy='paymentId' />
            <ThFilter {handler} filterBy='paymentType' />
            <ThFilter {handler} filterBy='customer' />
         </tr>
         <tr><th>${$paymentSum} total payments</th></tr>
      </thead>
      <tbody>
         {#each $rows as row}
         <tr>
            <td>{row.paymentCompleted?.getDate()}/{row.paymentCompleted?.getMonth()}/{row.paymentCompleted?.getFullYear()}</td>
            <td>{row.paymentType}</td>
            <td>{row.familyName}, {row.givenName}</td>
         </tr>
         {/each}
      </tbody>
   </table>
{/if}