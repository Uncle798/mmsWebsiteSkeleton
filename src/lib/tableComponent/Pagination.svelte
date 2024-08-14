<script lang="ts">
   import { DataHandler } from "@vincjo/datatables";
   export let handler: DataHandler;
   const currentPage = handler.getPageNumber();
   const pageCount = handler.getPageCount();
   const pages = handler.getPages({ ellipsis: true });
</script>

<section>
   <button type="button" class:disabled={$currentPage === 1} on:click={()=> handler.setPage('previous')}>
      Previous
   </button>
   {#each $pages as page}
      <button 
         type='button' 
         class:active={$currentPage === page} 
         class:ellipse={page === null}
         on:click={()=> handler.setPage(page)}
      >
         {page ?? '...'}
      </button>
   {/each}
   <button
      type="button"
      class:disabled={$currentPage === $pageCount}
      on:click={()=> handler.setPage('next')}
      >
      Next
   </button>
</section>

