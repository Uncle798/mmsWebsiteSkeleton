<script lang="ts">
    import BasicPaymentRecord from '$lib/leaseComponents/BasicPaymentRecord.svelte';
    
    import type { PageData } from './$types';
    
   interface Props {
      data: PageData;
   }

   let { data }: Props = $props();
    const { paymentRecords } = data
</script>

{#each paymentRecords as record}
   <BasicPaymentRecord record={record} />
{/each}