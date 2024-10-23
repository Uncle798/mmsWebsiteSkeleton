<script lang="ts">
   import dayjs from 'dayjs';
   import type {Invoice} from 'prisma/prisma-client';
   interface Props {
      invoice: Invoice;
   }

   let { invoice }: Props = $props();
</script>
<div class="card">
   <p>Invoice created: {dayjs(invoice.invoiceCreated).format('M/D/YYYY')}</p>
   <p>Invoice amount: ${invoice.invoiceAmount}</p>
   {#if invoice.invoicePaid}
      <p><a href="/paymentRecord/{invoice.paymentRecordId}" >Invoice paid: {dayjs(invoice.invoicePaid).format('M/D/YYYY')}</a></p>
   {/if}
   <p>Invoice notes: {invoice.invoiceNotes}</p>
</div>