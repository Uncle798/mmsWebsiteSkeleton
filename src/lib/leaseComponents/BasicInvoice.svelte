<script lang="ts">
   import type {Invoice} from 'prisma/prisma-client';
   export let invoice:Invoice;
</script>
{invoice.amount}
{invoice.invoicePaid}