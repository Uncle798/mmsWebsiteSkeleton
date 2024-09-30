<script lang="ts">
   // @ts-ignore: it works
   import { PUBLIC_COMPANY_NAME } from '$env/static/public'
   import type { PageData } from "./$types";
   import type { Unit } from '@prisma/client';
	import { getModalStore } from '@skeletonlabs/skeleton';
   import type { ModalComponent, ModalSettings } from '@skeletonlabs/skeleton';
	import PricingModal from '$lib/unitComponents/PricingModal.svelte';
	import BasicUnitEmployee from '$lib/unitComponents/BasicUnitEmployee.svelte';
	import NameBlock from '$lib/userComponents/NameBlock.svelte';
   export let data;

   $: units = data.units;
   const modalStore = getModalStore();
   const modalComponent: ModalComponent = {
      ref: PricingModal
   }
   function modalFire():void {
      const modal:ModalSettings = {
         type: 'component',
         component: modalComponent,
         title: 'Set new price by size',
         body: 'Select a size and set a new price for it.'
      }
      modalStore.trigger(modal);
   }
</script>

<svelte:head>
   <title>{PUBLIC_COMPANY_NAME} | All Units</title>
</svelte:head>

<div>
   <button class="btn" on:click={modalFire}>Set new price by size</button>
</div>
{#if  units}
   {#each units as unit}
   <div class="card">
      <BasicUnitEmployee unit={unit} lease={data.leases?.find((lease) => lease.unitNum === unit.num)} data={data.unitComponentForm}/>
   </div>

   {/each}
{/if}