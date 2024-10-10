<script lang="ts">
   import dayjs from 'dayjs';
   import type {Invoice} from 'prisma/prisma-client';
   export let invoice:Invoice;
</script>
<div class="card">
   <p>Invoice created: {dayjs(invoice.invoiceCreated).format('MMMM YYYY')}</p>
   <p>Invoice amount: ${invoice.invoiceAmount}</p>
   {#if invoice.invoicePaid}
      <p>Invoice paid: {dayjs(invoice.invoicePaid).format('MMMM YYYY')}</p>
   {/if}
   <p>Invoice notes: {invoice.invoiceNotes}</p>
</div>