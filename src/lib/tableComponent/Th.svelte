<script lang="ts">
   import type { DataHandler  } from "@vincjo/datatables";
   export let handler:DataHandler;
   export let orderBy='null';

   const identifier = orderBy.toString();
   const sorted = handler.getSort();
</script>

<th on:click={()=> handler.sort(orderBy)} class:active={$sorted.identifier === identifier} >
   <div class="flex">
      <strong>
         <slot />
      </strong>
      <span class:asc={$sorted.direction === 'asc'} class:desc={$sorted.direction === 'desc'} />
   </div>

</th>

