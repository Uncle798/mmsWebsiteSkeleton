<script lang="ts">
    import BasicInvoice from '$lib/leaseComponents/BasicInvoice.svelte';
    import type { PageData } from './$types';
    
    export let data: PageData;
    const { invoice }= data
</script>
{#if invoice}
    <BasicInvoice invoice={invoice} />
{/if}