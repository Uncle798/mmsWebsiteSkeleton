<script lang="ts">
   import { DataHandler } from "@vincjo/datatables";
   interface Props {
      handler: DataHandler;
   }

   let { handler }: Props = $props();
   const currentPage = handler.getPageNumber();
   const pageCount = handler.getPageCount();
   const pages = handler.getPages({ ellipsis: true });
</script>

<section>
   <button type="button" class:disabled={$currentPage === 1} onclick={()=> handler.setPage('previous')}>
      Previous
   </button>
   {#each $pages as page}
      <button 
         type='button' 
         class:active={$currentPage === page} 
         class:ellipse={page === null}
         onclick={()=> handler.setPage(page)}
      >
         {page ?? '...'}
      </button>
   {/each}
   <button
      type="button"
      class:disabled={$currentPage === $pageCount}
      onclick={()=> handler.setPage('next')}
      >
      Next
   </button>
</section>

