<script lang="ts">
    import BasicLease from '$lib/leaseComponents/BasicLease.svelte';
import type { PageData } from './$types';
    
    export let data: PageData;
</script>

{#each data.leases as lease}
    <BasicLease lease={lease} customer={data.customers.find((customer) => customer.id === lease.customerId)} />
{/each}