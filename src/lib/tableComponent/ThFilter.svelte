<script lang="ts">
   import type { DataHandler } from "@vincjo/datatables";
   export let handler: DataHandler
   export let filterBy = '';
   let value = ''
</script>

<th>
   <input type="text" placeholder="Filter" bind:value on:input={()=> handler.filter(value, filterBy)} />
</th>
