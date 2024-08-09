<script lang="ts">
   import type { DataHandler } from "@vincjo/datatables";
   export let handler: DataHandler;
   const rowsPerPage = handler.getRowsPerPage();
   const options = [5,10,20,50,100]
</script>

<aside>
   Show
   <select name="rowsPerPageOptions" bind:value={$rowsPerPage}>
      {#each options as option}
         <option value={option}>
            {option}
         </option>
      {/each}
   </select>
   rows per page
</aside>


<style>
   aside {
       display: flex;
       justify-content: flex-start;
       align-items: center;
       height: 32px;
       color: #616161;
   }
   select {
       margin: 0 2px;
       border-radius: .25rem;
   }
</style>