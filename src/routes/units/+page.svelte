<script lang="ts">
   import type { PageData } from "../$types";
   import { DataHandler } from '@vincjo/datatables';
   import Th from '$lib/tableComponent/Th.svelte'
   import ThFilter from "$lib/tableComponent/ThFilter.svelte";
   import Search from "$lib/tableComponent/Search.svelte";
   import RowsPerPage from "$lib/tableComponent/RowsPerPage.svelte";
	import Pagination from "$lib/tableComponent/Pagination.svelte";
   export let data;
   const handler = new DataHandler(data.tableData, { rowsPerPage: 50})
   const rows = handler.getRows();
</script>

<header>
   <Search {handler} />
   <RowsPerPage {handler} />
</header>

<table>
   <thead>
      <tr>
         <th>Unit num</th>
         <th>Customer</th>
         <th>Lease price / Current Price</th>
         <th>Leased since / Empty for</th>
      </tr>
      <tr>
         <ThFilter {handler} filterBy='unitNum' />
         <ThFilter {handler} filterBy='customer' />
         <ThFilter {handler} filterBy='price' />
         <ThFilter {handler} filterBy='emptyFor' />
      </tr>
   </thead>
   <tbody>
      {#each $rows as row}
         <tr>
            <td><a href="/units/{row.unitNum}">{row.unitNum.replace(/^0+/gm,'')}</a></td>
            {#if row.emptyFor > 0}
               <td>Empty Unit</td>
               <td>${row.price}</td>
               <td>{row.emptyFor} months</td>
               {:else}
               <td>{row.familyName}, {row.givenName}
                  {#if row.organizationName}
                     , {row.organizationName}
                  {/if}
               </td>
               <td>${row.price}</td>
               <td>{row.leasedFor} months</td>
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

       