<script lang="ts">
   import { getModalStore } from "@skeletonlabs/skeleton";
   import { page } from "$app/stores";
   import { onMount, type SvelteComponent } from "svelte";
	import NameForm from "../forms/NameForm.svelte";

   export let parent:SvelteComponent;
   const modalStore = getModalStore();
   function onClose() {
      modalStore.close();
   };
   onMount(()=>{
      console.log("modal store: "+ $modalStore[0].body)
   });
</script>
{#if $modalStore[0]}
   <div class="card p-4 w-modal shadow-xl space-y-4">
     <header class="text-2xl font-bold">{$modalStore[0].title ?? 'Title missing'}</header>
     <article>{$modalStore[0].body ?? 'Body missing'}</article>
      <NameForm data={$page.data.nameForm} />
      <button class="btn {parent.buttonNeutral}" on:click={onClose}>{parent.buttonTextCancel}</button>
   </div>
{/if}