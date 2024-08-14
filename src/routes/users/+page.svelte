
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

<header>
   <Search {handler} />
   <RowsPerPage {handler} />
   {#if $message}
	<h3>{$message}</h3>
   {/if}
</header>

<table>
   <thead>
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
      <!-- <form method="POST" use:enhance> -->
         <!-- <input type="hidden" name="__superform_id" bind:value={$formId} /> -->
         <tr>
            <td><a href="/users/{row.id}"> {row.familyName}</a></td>
            <td><a href="/users/{row.id}"> {row.givenName}</a></td>
            <td><a href="/users/{row.id}"> {row.email}</a></td>
         </tr>
      <!-- </form> -->
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

       