<script>
   import { createEventDispatcher } from "svelte";
   import { fade } from "svelte/transition";
   import SuccessIcon from "./icons/successIcon.svelte";
   import ErrorIcon from "./icons/errorIcon.svelte";
   import InfoIcon from "./icons/infoIcon.svelte";
   import CloseIcon from "./icons/closeIcon.svelte";

   const dispatch = createEventDispatcher();
   export let type = 'error';
   export const dismissible = true;
</script>

<article class={type} role="alert" transition:fade>
   {#if type === 'success'}
      <SuccessIcon width='1.1em' />
   {:else if type === 'error'}
      <ErrorIcon width='1.1em' />
   {:else if type === 'info'}
      <InfoIcon width='1.1em' />
   {/if}

   <div class="text">
      <slot />
   </div>
   <button class="close" on:click={()=> dispatch('dismiss')}>
      <CloseIcon width='0.8em' />
   </button>
</article>

<style lang="postcss">
   article {
     color: white;
     padding: 0.75rem 1.5rem;
     border-radius: 0.2rem;
     display: flex;
     align-items: center;
     margin: 0 auto 0.5rem auto;
     width: 20rem;
   }
   .error {
     background: IndianRed;
   }
   .success {
     background: MediumSeaGreen;
   }
   .info {
     background: SkyBlue;
   }
   .text {
     margin-left: 1rem;
   }
   button {
     color: white;
     background: transparent;
     border: 0 none;
     padding: 0;
     margin: 0 0 0 auto;
     line-height: 1;
     font-size: 1rem;
   }
 </style>