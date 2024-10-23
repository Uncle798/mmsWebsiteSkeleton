<script lang='ts'>
   import type { DataHandler } from "@vincjo/datatables";
   interface Props {
      handler: DataHandler;
   }

   let { handler }: Props = $props();
   let value = $state('')
</script>

<input class="input" placeholder="Search" bind:value oninput={() => handler.search(value)} />

