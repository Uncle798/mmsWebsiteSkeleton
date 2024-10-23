<script lang="ts">
   import type { DataHandler  } from "@vincjo/datatables";
   interface Props {
      handler: DataHandler;
      orderBy?: string;
      children?: import('svelte').Snippet;
   }

   let { handler, orderBy = 'null', children }: Props = $props();

   const identifier = orderBy.toString();
   const sorted = handler.getSort();
</script>

<th onclick={()=> handler.sort(orderBy)} class:active={$sorted.identifier === identifier} >
   <div class="flex">
      <strong>
         {@render children?.()}
      </strong>
      <span class:asc={$sorted.direction === 'asc'} class:desc={$sorted.direction === 'desc'}></span>
   </div>

</th>

