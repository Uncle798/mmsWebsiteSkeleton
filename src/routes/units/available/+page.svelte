<script lang="ts"> 
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
	<title>Moscow Mini Storage | Available Units</title>
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
      {#each $rows as row}
         <tr>
            <td>{row.unitNum.replace(/^0+/gm,'')}</td>
            <td>{row.size.replace(/^0+/gm,'')}</td>
            <td>{row.description}</td>
            <td>${row.price}</td>
         </tr>
      {/each}
   </tbody>
   
</table>
<footer>
   <Pagination {handler} />
</footer>