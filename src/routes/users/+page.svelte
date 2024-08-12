
<script lang="ts">
   import type { PageData } from "../$types";
   import { DataHandler } from '@vincjo/datatables';
   import Th from '$lib/tableComponent/Th.svelte'
   import ThFilter from "$lib/tableComponent/ThFilter.svelte";
   import Search from "$lib/tableComponent/Search.svelte";
   import RowsPerPage from "$lib/tableComponent/RowsPerPage.svelte";
	import Pagination from "$lib/tableComponent/Pagination.svelte";
   export let data;
   const handler = new DataHandler(data.data, { rowsPerPage: 50})
   const rows = handler.getRows();
</script>

<header>
   <Search {handler} />
   <RowsPerPage {handler} />
</header>

<table>
   <thead>
      <tr>
         <th>Family name</th>
         <th>Given name</th>
         <th>Email address</th>
         <th>Organization name</th>
         <th>Address 1</th>
         <!-- <th>Address 2</th>
         <th>Address 3</th> -->
         <th>City</th>
         <th>State</th>
         <th>Zip</th>
         <th>Lease Start Date</th>
         <th>Lease End Date</th>
      </tr>
      <tr>
         <ThFilter {handler} filterBy='familyName' />
         <ThFilter {handler} filterBy='givenName' />
         <ThFilter {handler} filterBy='email' />
         <ThFilter {handler} filterBy='organizationName' />
         <ThFilter {handler} filterBy='address1' />
         <!-- <ThFilter {handler} filterBy='address2' />
         <ThFilter {handler} filterBy='address3' /> -->
         <ThFilter {handler} filterBy='city' />
         <ThFilter {handler} filterBy='state' />
         <ThFilter {handler} filterBy='zip' />
         <ThFilter {handler} filterBy='leaseStart' />
         <ThFilter {handler} filterBy='leaseEndDate' />
      </tr>
   </thead>
   <tbody>
      {#each $rows as row}
         <tr>
            <td>{row.familyName}</td>
            <td>{row.givenName}</td>
            <td>{row.email}</td>
            {#if !row.organizationName}
            <td>None</td>
            {:else}
            <td>{row.organizationName}</td>
            {/if}
            <td>{row.address1}</td>
            <td>{row.city}</td>
            <td>{row.state}</td>
            <td>{row.zip}</td>
            {#if row.leaseEffectiveDate}
               <td>{row.leaseEffectiveDate}</td>
            {:else if !row.leaseEnded}
               <td>No leases</td>
            {/if}
            {#if row.leaseEnded}
               <td>{row.leaseEnded}</td>
            {:else if !row.leaseEffectiveDate}
               <td>No leases</td>
            {/if}
         </tr>
      {/each}
   </tbody>
</table>
<footer>
   <Pagination {handler} />
</footer>

<style>
   header,
   footer {
       height: 48px;
       padding: 0 16px;
       display: flex;
       justify-content: space-between;
       align-items: center;
   }
   footer {
       border-top: 1px solid #e0e0e0;
   }
   table {
       text-align: left;
       border-collapse: separate;
       border-spacing: 0;
       width: 100%;
   }
   thead {
      position: sticky;
      inset-block-start: 0;
   }
   tbody tr:hover {
       background: #f5f5f5;
       transition: background, 0.2s;
       color: #0f0f0f;
   }
   td {
       padding: 4px 20px;
       border-bottom: 1px solid #eee;
   }
</style>

       