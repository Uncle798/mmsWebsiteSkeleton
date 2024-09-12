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

   export let data:PageData;
   export const { contactInfo, dbUser, leases, tableData } = data;
   const handler = new DataHandler(tableData, {rowsPerPage:  10});
   const rows = handler.getRows();
   const rowCount = handler.getRowCount();
   const paymentSum = handler.createCalculation('amount').sum()
   
</script>

<svelte:head>
	<title>{PUBLIC_COMPANY_NAME} | User: {dbUser?.givenName} {dbUser?.familyName}</title>
</svelte:head>

{#if dbUser}
<NameBlock nameBlock={dbUser} />
{/if}
{#each contactInfo as info}   
   <Address address={info}/>
{/each}
{#each leases as lease}   
   <BasicLease lease={lease} />
{/each}
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
            <ThFilter {handler} filterBy='amount' />
            <ThFilter {handler} filterBy='paymentId' />
            <ThFilter {handler} filterBy='paymentType' />
            <ThFilter {handler} filterBy='customer' />
         </tr>
         <tr><th>${$paymentSum} total payments</th></tr>
      </thead>
      <tbody>
         {#each $rows as row}
         <tr>
            <td>${row.amount}</td>
            <td>{row.invoiceNum}</td>
            <td>{row.paymentCompleted?.getDate()}/{row.paymentCompleted?.getMonth()}/{row.paymentCompleted?.getFullYear()}</td>
            <td>{row.paymentType}</td>
            <td>{row.familyName}, {row.givenName}</td>
         </tr>
         {/each}
      </tbody>
   </table>
{/if}