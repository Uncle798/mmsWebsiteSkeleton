<script lang="ts">
   import dayjs from 'dayjs';
   import type {PaymentRecord} from 'prisma/prisma-client';
   interface Props {
      record: PaymentRecord;
   }

   let { record }: Props = $props();
</script>

<div class="card">
   <p>Payment amount: ${record.paymentAmount}</p>
   <p>{dayjs(record.paymentCompleted).format('MM/DD/YYYY')}</p>
   <p>Payment notes {record.paymentNotes}</p>
</div>
