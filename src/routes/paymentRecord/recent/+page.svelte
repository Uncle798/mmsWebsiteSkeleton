<script lang="ts">
    import BasicPaymentRecord from '$lib/leaseComponents/BasicPaymentRecord.svelte';
    
    import type { PageData } from './$types';
    
    export let data: PageData;
    const { paymentRecords } = data
</script>

{#each paymentRecords as record}
   <BasicPaymentRecord record={record} />
{/each}