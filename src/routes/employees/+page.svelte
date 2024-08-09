<script lang="ts">
   import type { PageData } from "../$types";
   import { DataHandler } from '@vincjo/datatables';
   import Th from '$lib/tableComponent/Th.svelte'
   import ThFilter from "$lib/tableComponent/ThFilter.svelte";
   import Search from "$lib/tableComponent/Search.svelte";
   import RowsPerPage from "$lib/tableComponent/RowsPerPage.svelte";
	import Pagination from "$lib/tableComponent/Pagination.svelte";
   import ErrorIcon from "$lib/Toasts/icons/errorIcon.svelte";
	import { addToast } from "$lib/Toasts/store";

   export let data;
   const handler = new DataHandler(data.employees, { rowsPerPage: 50})
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
         <th>Is admin</th>
         <th>Remove Employee</th>
      </tr>
      <tr>
         <ThFilter {handler} filterBy='familyName' />
         <ThFilter {handler} filterBy='givenName' />
         <ThFilter {handler} filterBy='isAdmin' />
         <th></th>
      </tr>
   </thead>
   <tbody>
      {#each $rows as row}
         <tr>
            <td>{row.familyName}</td>
            <td>{row.givenName}</td>
            <td><input type="checkbox" name="isAdmin" bind:checked={row.admin}> <button on:click={()=> 
               addToast('Are you sure you\'d like to remove admin rights for this employee?')}>Remove Admin Rights</button></td>
            <td>
               <button on:click={()=> addToast({
                  message: "Are you sure?<br/><form method='POST' action=''><input type='hidden' name='employeeId 'value={row.id}><button>Yes</button></form>",
                  type: 'error',
                  timeout:0,
                  dismissible: false, 
                  id:row.id})}>Remove Employee</button>
            </td>
         </tr>
      {/each}
   </tbody>
</table>