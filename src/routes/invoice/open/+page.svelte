<script lang="ts">
    import BasicInvoice from '$lib/leaseComponents/BasicInvoice.svelte';
	import NameBlock from '$lib/userComponents/NameBlock.svelte';
    import { createSearchStore, searchHandler } from '$lib/stores/search';
    import type { PageData } from './$types';
	import { getModalStore, type ModalComponent, type ModalSettings } from '@skeletonlabs/skeleton';
	import PaymentRecordModal from '$lib/modals/PaymentRecordModal.svelte';
	import type { Invoice  } from '@prisma/client';
    import type { PartialUser } from '$lib/server/partialTypes';

    interface Props {
        data: PageData;
    }

    let { data }: Props = $props();
    const {customers, invoices, leases } = data;
    const searchInvoices = invoices.map((invoice)=> {
        const customer = customers.find((c) => c.id === invoice.customerId);
        return {
            ...invoice,
            searchTerms: `
            ${invoice.invoiceNotes} 
            ${invoice.invoiceNum} 
            ${customer?.familyName} 
            ${customer?.givenName} 
            ${customer?.email}
            `
        }
    });
    const searchStore = createSearchStore(searchInvoices);
    const unsubscribe = searchStore.subscribe((model) => searchHandler(model));
    const modalStore = getModalStore();
    const modalComponent: ModalComponent = {
        ref: PaymentRecordModal
    }
    function modalFire(invoice:Invoice, customer:PartialUser){
        const customerLeases = leases.filter((lease) => lease.customerId === customer.id)
        const modal:ModalSettings = {
            type: 'component',
            component: modalComponent,
            title: 'New Payment record',
            body: `Payment for invoice number ${invoice.invoiceNum}`,
            meta: {
                invoice,
                customer,
                customerLeases,
            }
        }
        modalStore.trigger(modal);
    }
</script>
    <div><input type="search" name="invoiceSearch"  id="invoiceSearch" class="input" bind:value={$searchStore.search}></div>
{#each $searchStore.filtered as invoice}
{@const customer = customers.find((c) => c.id === invoice.customerId)}
<div class="card">
    <BasicInvoice invoice={invoice} />
    {#if customer}
        <NameBlock nameBlock= {customer} />
        <div>
            <button class="btn" onclick={()=>modalFire(invoice, customer)}>Make a payment</button>
        </div>
    {/if}
</div>
{/each}