<script>
   import BasicLease from '$lib/leaseComponents/BasicLease.svelte';
   import Address from '$lib/userComponents/Address.svelte';
   import NameBlock from '$lib/userComponents/NameBlock.svelte';
   import Th from '$lib/tableComponent/Th.svelte'
   import ThFilter from "$lib/tableComponent/ThFilter.svelte";
   import Search from "$lib/tableComponent/Search.svelte";
   import RowsPerPage from "$lib/tableComponent/RowsPerPage.svelte";
	import Pagination from "$lib/tableComponent/Pagination.svelte"; 
	import { DataHandler } from '@vincjo/datatables';

   export let data;
   export const { contactInfo, dbUser, leases, paymentTableData } = data;
   const handler = new DataHandler(paymentTableData, {rowsPerPage:  10});
   const rows = handler.getRows();
   const rowCount = handler.getRowCount();
   const paymentSum = handler.createCalculation('amount').sum()
   
</script>

<svelte:head>
	<title>{process.env.COMPANY_NAME} | User: {dbUser?.givenName} {dbUser?.familyName}</title>
</svelte:head>

<NameBlock nameBlock={dbUser} />

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
            <Th {handler}>Amount</Th>
            <Th {handler}>Invoice num</Th>
            <Th {handler}>Payment Type</Th>
            <Th {handler}>Employee</Th>
         </tr>
         <tr>
            <ThFilter {handler} filterBy='amount' />
            <ThFilter {handler} filterBy='paymentId' />
            <ThFilter {handler} filterBy='paymentType' />
            <ThFilter {handler} filterBy='employee' />
         </tr>
         <tr><th>${$paymentSum} total payments</th></tr>
      </thead>
      <tbody>
         {#each $rows as row}
         <tr>
            <td>${row.amount}</td>
            <td>{row.invoiceNum}</td>
            <td>{row.paymentType}</td>
            <td>{row.familyName}, {row.givenName}</td>
         </tr>
         {/each}
      </tbody>
   </table>
{/if}