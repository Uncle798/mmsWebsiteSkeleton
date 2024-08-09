
<script lang="ts">
   import type { PageData } from "../$types";
   import { DataHandler } from '@vincjo/datatables';
   import Th from '$lib/tableComponent/Th.svelte'
   import ThFilter from "$lib/tableComponent/ThFilter.svelte";
   import Search from "$lib/tableComponent/Search.svelte";
   import RowsPerPage from "$lib/tableComponent/RowsPerPage.svelte";
	import Pagination from "$lib/tableComponent/Pagination.svelte";
   export let data;
   const handler = new DataHandler(data.users, { rowsPerPage: 50})
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
         <th>Address 2</th>
         <th>Address 3</th>
      </tr>
      <tr>
         <ThFilter {handler} filterBy='familyName' />
         <ThFilter {handler} filterBy='givenName' />
         <ThFilter {handler} filterBy='emailAddress' />
         <ThFilter {handler} filterBy='organizationName' />
         <ThFilter {handler} filterBy='address1' />
         <ThFilter {handler} filterBy='address2' />
         <ThFilter {handler} filterBy='address3' />
         <ThFilter {handler} filterBy='City' />
         <ThFilter {handler} filterBy='State' />
         <ThFilter {handler} filterBy='Zip' />
      </tr>
   </thead>
   <tbody>
      {#each $rows as row}
         <tr>
            <td>{row.familyName}</td>
            <td>{row.givenName}</td>
            <td>{row.email}</td>
            <td>{data.contactInfos.find((contact)=> contact.email === row.email)?.organizationName}</td>
            <td>{data.contactInfos.find((contact)=> contact.email === row.email)?.address1}</td>
            {#if data.contactInfos.find((contact)=> contact.email === row.email)?.address2}
               <td>{data.contactInfos.find((contact)=> contact.email === row.email)?.address2}</td>
               {:else}
               <td></td>
               {/if}
               {#if data.contactInfos.find((contact)=> contact.email === row.email)?.address3}
               <td>{data.contactInfos.find((contact)=> contact.email === row.email)?.address3}</td>
               {:else}
               <td></td>
            {/if}
            <td>{data.contactInfos.find((contact)=> contact.email === row.email)?.city}</td>
            <td>{data.contactInfos.find((contact)=> contact.email === row.email)?.state}</td>
            <td>{data.contactInfos.find((contact)=> contact.email === row.email)?.zip}</td>
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
   }
   td {
       padding: 4px 20px;
       border-bottom: 1px solid #eee;
   }
</style>

       