<script lang="ts">
    import BasicLease from '$lib/leaseComponents/BasicLease.svelte';
import type { PageData } from './$types';
    
    interface Props {
        data: PageData;
    }

    let { data }: Props = $props();
</script>

{#each data.leases as lease}
    <BasicLease lease={lease} customer={data.customers.find((customer) => customer.id === lease.customerId)} />
{/each}