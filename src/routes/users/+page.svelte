
<script lang="ts">
   import type { PageData } from "./$types";
   // @ts-ignore: it works
   import { PUBLIC_COMPANY_NAME } from '$env/static/public'
   import { DataHandler } from '@vincjo/datatables';
   import Th from '$lib/tableComponent/Th.svelte'
   import ThFilter from "$lib/tableComponent/ThFilter.svelte";
   import Search from "$lib/tableComponent/Search.svelte";
   import RowsPerPage from "$lib/tableComponent/RowsPerPage.svelte";
	import Pagination from "$lib/tableComponent/Pagination.svelte";
   import EmploymentConfirmModal from "$lib/userComponents/EmploymentConfirmModal.svelte";
	import { getModalStore, type ModalComponent, type ModalSettings } from "@skeletonlabs/skeleton";
	import type { PartialUser } from "$lib/server/partialTypes";
   export let data:PageData;
   const handler = new DataHandler(data.users, { rowsPerPage: 50})
   const rows = handler.getRows();
   const modalStore = getModalStore();
   const modalComponent: ModalComponent = {
      ref: EmploymentConfirmModal,
   }
   function modalFire(employee:boolean, admin: boolean, userId:string, givenName:string|null, familyName: string|null):void {
      const modal:ModalSettings = {
         type: 'component',
         component: modalComponent,
         title:'Are you sure you\'d like to change employment status?',
         body:`of ${givenName} ${familyName}`,
         meta: {
            employee,
            admin,
            userId,
         }
      }
      modalStore.trigger(modal);
   }
</script>

<svelte:head>
	<title>{PUBLIC_COMPANY_NAME} | All Users</title>
</svelte:head>

<div class="table-container">
   <table class="table table-hover">
      <thead class="table-header-group table">
         <tr class="table-row">
               <Search {handler}/>
               <RowsPerPage {handler} />
         </tr>
         <tr class="table-row">
            <Th {handler}>Family name</Th>
            <Th {handler}>Given name</Th>
            <Th {handler}>Email address</Th>
            <Th {handler}>Employee</Th>
            <Th {handler}>Admin</Th>
            <td>Update employment status</td>
         </tr>
         <tr class="table-row">
            <ThFilter {handler} filterBy='familyName' />
            <ThFilter {handler} filterBy='givenName' />
            <ThFilter {handler} filterBy='email' />
            <ThFilter {handler} filterBy='employee' placeholder='true/false'/>
            <ThFilter {handler} filterBy='admin' placeholder='true/false'/>
            <td>Update employment status</td>
         </tr>
      </thead>
      <tbody>
         {#each $rows as row}
         <tr>
            <td class="td"><a href="/users/{row.id}"> {row.familyName}</a></td>
            <td><a href="/users/{row.id}"> {row.givenName}</a></td>
            <td><a href="/users/{row.id}"> {row.email}</a></td>
            <td><input type="checkbox" class="checkbox" name="employee" checked={row.employee}></td>
            <td><input type="checkbox" class="checkbox" name="admin" checked={row.admin}></td>
            <td><button class="btn" on:click={()=>modalFire(row.employee, row.admin, row.id, row.givenName, row.familyName)}>Update Employee Status</button></td>
         </tr>
         {/each}
      </tbody>
   </table>
</div>
   
   <footer>
      <Pagination {handler} />
   </footer>