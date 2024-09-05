<script lang="ts">
   // @ts-ignore: it works
   import { PUBLIC_COMPANY_NAME } from '$env/static/public'

   import { DataHandler } from '@vincjo/datatables';
   import Th from '$lib/tableComponent/Th.svelte'
   import ThFilter from "$lib/tableComponent/ThFilter.svelte";
   import Search from "$lib/tableComponent/Search.svelte";
   import RowsPerPage from "$lib/tableComponent/RowsPerPage.svelte";
	import Pagination from "$lib/tableComponent/Pagination.svelte";
	import type { PageData } from './$types';
   export let data:PageData;
   const handler = new DataHandler(data.availableUnits, { rowsPerPage: 50})
   const rows = handler.getRows();
</script>

<svelte:head>
	<title>{PUBLIC_COMPANY_NAME} | Available Units</title>
</svelte:head>


<header>
   <Search {handler} />
   <RowsPerPage {handler} />
</header>
<table class="table table-hover">
   <thead>
      <tr>
         <th>Unit Number</th>
         <th>Size (WxL in feet)</th>
         <th>Approximate amount of stuff</th>
         <th>Price per month</th>
      </tr>
      <tr>
         <ThFilter {handler} filterBy='unitNum' />
         <ThFilter {handler} filterBy='size' />
         <ThFilter {handler} filterBy='description' />
         <ThFilter {handler} filterBy='price' />
      </tr>
   </thead>
   <tbody>
      {#if data.user}    
         {#each $rows as row}
         <tr>
            <td><a href="/units/newLease/?unitNum={row.unitNum}">{row.unitNum.replace(/^0+/gm,'')}</a></td>
            <td><a href="/units/newLease/?unitNum={row.unitNum}">{row.size.replace(/^0+/gm,'')}</a></td>
            <td><a href="/units/newLease/?unitNum={row.unitNum}">{row.description}</a></td>
            <td><a href="/units/newLease/?unitNum={row.unitNum}">${row.price}</a></td>
         </tr>
         {/each}
      {:else}
         {#each $rows as row}
         <tr>
            <td><a href="/register?unitNum={row.unitNum}">{row.unitNum.replace(/^0+/gm,'')}</a></td>
            <td><a href="/register?unitNum={row.unitNum}">{row.size.replace(/^0+/gm,'')}</a></td>
            <td><a href="/register?unitNum={row.unitNum}">{row.description}</a></td>
            <td><a href="/register?unitNum={row.unitNum}">${row.price}</a></td>
         </tr>
         {/each}
      {/if}
   </tbody>
   
</table>
<footer>
   <Pagination {handler} />
</footer>