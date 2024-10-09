<script lang="ts">
   import type {Invoice} from 'prisma/prisma-client';
   export let invoice:Invoice;
</script>

<p>Invoice created: {invoice.invoiceCreated}</p>
<p>Invoice amount: ${invoice.invoiceAmount}</p>
<p>Invoice paid: {invoice.invoicePaid}</p>
<p>Invoice notes: {invoice.invoiceNotes}</p>