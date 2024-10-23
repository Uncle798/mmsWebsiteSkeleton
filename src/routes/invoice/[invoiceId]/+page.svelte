<script lang="ts">
    import BasicInvoice from '$lib/leaseComponents/BasicInvoice.svelte';
    import type { PageData } from './$types';
    
    interface Props {
        data: PageData;
    }

    let { data }: Props = $props();
    const { invoice }= data
</script>
{#if invoice}
    <BasicInvoice invoice={invoice} />
{/if}