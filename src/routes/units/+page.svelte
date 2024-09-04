<script lang="ts">
   import { PUBLIC_COMPANY_NAME } from '$env/static/public'
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
<svelte:head>
   <title>{PUBLIC_COMPANY_NAME} | All Units</title>
</svelte:head>
<div class="table-container">
   <header>
      <Search {handler} />
      <RowsPerPage {handler} />
   </header>
   
   <table class="table table-hover">
      <thead>
         <tr>
            <th class="table-cell-fit">Unit num</th>
            <th>Customer</th>
            <th>Lease price / Current Price</th>
            <th>Leased since / Empty for</th>
         </tr>
         <tr>
            <ThFilter {handler} filterBy='unitNum' />
            <ThFilter {handler} filterBy='familyName' />
            <ThFilter {handler} filterBy='price' />
            <ThFilter {handler} filterBy='emptyFor' />
         </tr>
      </thead>
      <tbody>
         {#each $rows as row}
         <tr>
            <td class="table-cell-fit"><a href="/units/{row.unitNum}">{row.unitNum.replace(/^0+/gm,'')}</a></td>
            {#if row.emptyFor > 0 }
            <td>Empty Unit</td>
            <td>${row.price}</td>
            <td>{row.emptyFor} months</td>
            {:else}
            <td><a class="a" href="/users/{row.userId}">
               
               {row.familyName}, {row.givenName}
               {#if row.organizationName}
               , {row.organizationName}
               {/if}
            </a>
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

</div>
