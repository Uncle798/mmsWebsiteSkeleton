
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
   import { getToastStore, type ToastSettings } from "@skeletonlabs/skeleton";
   const toastStore = getToastStore();
   let toastId = '';
   function closeToast():void {
      toastStore.close(toastId);
   }
   function employeeToast():void {
      const t:ToastSettings = {
         message: 'Are you sure you would like to remove this employee?',

         autohide: false,
         action: {
            label: 'Yes I\'m sure',
            response:() => {
               console.log('hello')
            },
         }
      }
   }
</script>

<svelte:head>
	<title>Moscow Mini Storage | All Users</title>
</svelte:head>

<header class="w-1/4">
   {#if $message}
	<h3>{$message}</h3>
   {/if}
</header>
<form method="post" use:enhance>
   <table>
      <thead>
         <tr>
            <th>
               <Search {handler}/>
            </th>
            <th></th>
            <th>
               <RowsPerPage {handler} />
            </th>
         </tr>
         <tr>
            <Th {handler}>Family name</Th>
            <Th {handler}>Given name</Th>
            <Th {handler}>Email address</Th>
            <Th {handler}>Employee</Th>
            <Th {handler}>Admin</Th>
         </tr>
         <tr>
            <ThFilter {handler} filterBy='familyName' />
            <ThFilter {handler} filterBy='givenName' />
            <ThFilter {handler} filterBy='email' />
            <ThFilter {handler} filterBy='employee' placeholder='true/false'/>
            <ThFilter {handler} filterBy='admin' placeholder='true/false'/>
         </tr>
      </thead>
      <tbody>
         {#each $rows as row}
         <tr>
            <td><a href="/users/{row.id}"> {row.familyName}</a></td>
            <td><a href="/users/{row.id}"> {row.givenName}</a></td>
            <td><a href="/users/{row.id}"> {row.email}</a></td>
            <td><input type="checkbox" class="checkbox" name="employee" checked={row.employee}></td>
            <td><input type="checkbox" class="checkbox" name="admin" checked={row.admin}></td>
            <td><button class="btn" value={row.id} on:click={employeeToast}>Update Employee Status</button></td>
         </tr>
         {/each}
      </tbody>
   </table>
</form>
   <footer>
      <Pagination {handler} />
   </footer>