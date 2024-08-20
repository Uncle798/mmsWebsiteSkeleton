
<script lang="ts">
   import type { PageData } from "../$types";
   import { DataHandler } from '@vincjo/datatables';
   import { superForm } from "sveltekit-superforms";
   import Th from '$lib/tableComponent/Th.svelte'
   import ThFilter from "$lib/tableComponent/ThFilter.svelte";
   import Search from "$lib/tableComponent/Search.svelte";
   import RowsPerPage from "$lib/tableComponent/RowsPerPage.svelte";
	import Pagination from "$lib/tableComponent/Pagination.svelte";
   export let data;
   const handler = new DataHandler(data.users, { rowsPerPage: 50})
   const rows = handler.getRows();
   const { form, errors, constraints, message, formId, enhance } = superForm(data.form);
</script>

<header class="w-1/4">
   {#if $message}
	<h3>{$message}</h3>
   {/if}
</header>

<table>
   <thead>
      <tr>
         <th>
            <Search {handler}/>
         </th>
         <th>
            <RowsPerPage {handler} />
         </th>
      </tr>
      <tr>
         <Th {handler}>Family name</Th>
         <Th {handler}>Given name</Th>
         <Th {handler}>Email address</Th>
      </tr>
      <tr>
         <ThFilter {handler} filterBy='familyName' />
         <ThFilter {handler} filterBy='givenName' />
         <ThFilter {handler} filterBy='email' />
      </tr>
   </thead>
   <tbody>
      {#each $rows as row}
         <tr>
            <td><a href="/users/{row.id}"> {row.familyName}</a></td>
            <td><a href="/users/{row.id}"> {row.givenName}</a></td>
            <td><a href="/users/{row.id}"> {row.email}</a></td>
         </tr>
         {/each}
      </tbody>
   </table>
   <footer>
   <Pagination {handler} />
</footer>