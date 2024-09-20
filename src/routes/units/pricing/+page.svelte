<script lang="ts">
    import type { PageData } from './$types';
    import { PUBLIC_COMPANY_NAME } from '$env/static/public'
    import { createSearchStore, searchHandler } from '$lib/stores/search';
	import UnitPricing from '$lib/unitComponents/UnitPricing.svelte';
    import PricingModal from '$lib/unitComponents/PricingModal.svelte'
	import { getModalStore, type ModalComponent, type ModalSettings } from '@skeletonlabs/skeleton';
	
    export let data: PageData;

    const searchPricing = data.priceCount.map((price) =>( {
        ...price,
        searchTerms: `${price.notes} ${price} ${price.size}`
    }));
    const searchStore = createSearchStore(searchPricing);
    const unsubscribe = searchStore.subscribe((model) => searchHandler(model));

    const modalStore = getModalStore();
    const modalComponent:ModalComponent = {
        ref: PricingModal,
    }
    function modalFire(){
        const modal:ModalSettings = {
            type: 'component',
            component: modalComponent,
            title: 'New Price for Units by Size',
            body: `Please enter a new price`
        }
    }
</script>

<svelte:head>
	<title>{PUBLIC_COMPANY_NAME} | Pricing</title>
</svelte:head>

<div>
    <input type="search" name="search" id="search" placeholder="Search..." class="input" bind:value={$searchStore.search}/>
 </div>
<div>
    <button class="btn " on:click={modalFire}>Add new price</button>
</div>

 {#each $searchStore.filtered as price}
    <UnitPricing pricing={price} />
 {/each}