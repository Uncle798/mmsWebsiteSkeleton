<script lang="ts">
   import type { DataHandler } from "@vincjo/datatables";
   export let handler: DataHandler
   export let filterBy = '';
   export let placeholder = "Filter"
   let value = ''
</script>

<th class="table-cell">
   <input class="input" type="text" placeholder={placeholder} bind:value on:input={()=> handler.filter(value, filterBy)} />
</th>
