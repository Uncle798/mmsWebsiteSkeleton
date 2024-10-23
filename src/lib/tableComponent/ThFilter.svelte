<script lang="ts">
   import type { DataHandler } from "@vincjo/datatables";
   interface Props {
      handler: DataHandler;
      filterBy?: string;
      placeholder?: string;
   }

   let { handler, filterBy = '', placeholder = "Filter" }: Props = $props();
   let value = $state('')
</script>

<th class="table-cell">
   <input class="input" type="text" placeholder={placeholder} bind:value oninput={()=> handler.filter(value, filterBy)} />
</th>
