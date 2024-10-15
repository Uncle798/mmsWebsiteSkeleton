<script lang="ts">
    import BasicInvoice from '$lib/leaseComponents/BasicInvoice.svelte';
	import BasicPaymentRecord from '$lib/leaseComponents/BasicPaymentRecord.svelte';
import type { PageData } from './$types';
    
    export let data: PageData;
    const {paymentRecord} = data; 
</script>
{#if paymentRecord}
<BasicPaymentRecord record={paymentRecord} />
{/if}