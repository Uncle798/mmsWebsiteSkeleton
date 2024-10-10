<script lang="ts">
    import BasicInvoice from '$lib/leaseComponents/BasicInvoice.svelte';
	import NameBlock from '$lib/userComponents/NameBlock.svelte';
import type { PageData } from './$types';
    
    export let data: PageData;
    const {customers, invoices } = data
</script>
{#each invoices as invoice}
    <BasicInvoice invoice={invoice} />
    <NameBlock nameBlock= {customers.find((customer) => customer.id === invoice.customerId)} />
    {/each}