<script lang="ts">
   import type { DataHandler } from "@vincjo/datatables";
   interface Props {
      handler: DataHandler;
   }

   let { handler }: Props = $props();
   const rowsPerPage = handler.getRowsPerPage();
   const options = [5,10,20,50,100]
</script>

<aside>
   Show
   <select class="select" name="rowsPerPageOptions" bind:value={$rowsPerPage}>
      {#each options as option}
         <option class="option" value={option}>
            {option}
         </option>
      {/each}
   </select>
   rows per page
</aside>

