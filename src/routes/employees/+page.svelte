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
   const { employees } = data;
</script>


{#each employees as employee}
   <div class="card">
      {employee}
   </div>
{/each}