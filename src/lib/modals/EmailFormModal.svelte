<script lang="ts">
   import { getModalStore } from "@skeletonlabs/skeleton";
   import { page } from "$app/stores";
   import type { SvelteComponent } from "svelte";
	import EmailForm from "../forms/EmailForm.svelte";


   interface Props {
      parent: SvelteComponent;
   }

   let { parent }: Props = $props();
   const modalStore = getModalStore();
   function onClose() {
      modalStore.close();
   }
</script>
{#if $modalStore[0]}
   <div class="card p-4 w-modal shadow-xl space-y-4">
     <header class="text-2xl font-bold">{$modalStore[0].title ?? 'Title missing'}</header>
     <article>{$modalStore[0].body ?? 'Body missing'}</article>
      <EmailForm data={$page.data.emailForm}/>
      <button class="btn {parent.buttonNeutral}" onclick={onClose}>{parent.buttonTextCancel}</button>
   </div>
{/if}