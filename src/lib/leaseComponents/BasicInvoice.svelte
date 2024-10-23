<script lang="ts">
   import dayjs from 'dayjs';
   import type {Invoice} from 'prisma/prisma-client';
   export let invoice:Invoice;
</script>
<div class="card">
   <p>Invoice created: {dayjs(invoice.invoiceCreated).format('M/D/YYYY')}</p>
   <p>Invoice amount: ${invoice.invoiceAmount}</p>
   {#if invoice.invoicePaid}
      <p><a href="/paymentRecord/{invoice.paymentRecordId}" >Invoice paid: {dayjs(invoice.invoicePaid).format('M/D/YYYY')}</a></p>
   {/if}
   <p>Invoice notes: {invoice.invoiceNotes}</p>
</div>