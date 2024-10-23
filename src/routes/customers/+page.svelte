<script lang="ts">
   import { run } from 'svelte/legacy';

   import type { PageData } from "./$types";
   import { PUBLIC_COMPANY_NAME } from '$env/static/public'
   import { DataHandler } from '@vincjo/datatables';
   import Th from '$lib/tableComponent/Th.svelte'
   import ThFilter from "$lib/tableComponent/ThFilter.svelte";
   import Search from "$lib/tableComponent/Search.svelte";
   import RowsPerPage from "$lib/tableComponent/RowsPerPage.svelte";
	import Pagination from "$lib/tableComponent/Pagination.svelte";
	import { getModalStore, type ModalComponent, type ModalSettings } from "@skeletonlabs/skeleton";
	import ConfirmFormModal from "$lib/modals/ConfirmFormModal.svelte";

   interface Props {
      data: PageData;
   }

   let { data }: Props = $props();
   
   const handler = new DataHandler(data.tableData, { rowsPerPage: 50})
   run(() => {
      data.tableData, handler.setRows(data.tableData)
   });
   const rows = handler.getRows();
   const modalStore = getModalStore();
   const modalComponent:ModalComponent = {
      ref: ConfirmFormModal
   }
   function modalFire(customerId:string, leaseId: string,  unitNum:string|null, ):void {
      const modal:ModalSettings = {
         type: 'component',
         component: modalComponent,
         title:'Are you sure you\'d like to end this lease',
         body:`for Unit ${unitNum?.replace(/^0+/gm,'')}?`,
         meta: {
            customerId,
            leaseId,
         }
      }
      modalStore.trigger(modal);
   }
</script>

<svelte:head>
	<title>{PUBLIC_COMPANY_NAME} | Current Customers</title>
</svelte:head>


<div class="table-container">
   <table class="table table-hover">
      <thead class="table-header-group table">
         <tr class="table-row">
               <Search {handler}/>
               <RowsPerPage {handler} />
         </tr>
         <tr class="table-row">
            <Th {handler}>Unit Num</Th>
            <Th {handler}>Lease Price</Th>
            <Th {handler}>Family name</Th>
            <Th {handler}>Given name</Th>
            <Th {handler}>Email address</Th>
            <td>End Lease</td>
         </tr>
         <tr class="table-row">
            <ThFilter {handler} filterBy='unitNum' />
            <ThFilter {handler} filterBy='price' />
            <ThFilter {handler} filterBy='familyName' />
            <ThFilter {handler} filterBy='givenName' />
            <ThFilter {handler} filterBy='email' />
         </tr>
      </thead>
      <tbody>
         {#each $rows as row}
         <tr>
            <td><a href="/units/{row.unitNum}">{row.unitNum.replace(/^0+/gm,'')}</a></td>
            <td><a href="/units/{row.unitNum}">${row.price}</a></td>
            <td class="td"><a href="/users/{row.id}"> {row.familyName}</a></td>
            <td><a href="/users/{row.id}"> {row.givenName}</a></td>
            <td><a href="/users/{row.id}" class="btn"> {row.email}</a></td>
            <td><button class="btn" onclick={()=>modalFire(row.id, row.leaseId, row.unitNum)}>End Lease</button></td>
         </tr>
         {/each}
      </tbody>
   </table>
</div>
   
   <footer>
      <Pagination {handler} />
   </footer>