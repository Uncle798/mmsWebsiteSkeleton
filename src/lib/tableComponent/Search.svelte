<script lang='ts'>
   import type { DataHandler } from "@vincjo/datatables";
   export let handler: DataHandler;
   let value = ''
</script>

<input placeholder="Search" bind:value on:input={() => handler.search(value)} />

