<script lang="ts">
    import BasicInvoice from '$lib/leaseComponents/BasicInvoice.svelte';
    import type { PageData } from './$types';
    
    export let data: PageData;
</script>
<BasicInvoice invoice={data.invoice} />