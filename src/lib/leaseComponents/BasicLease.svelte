<script lang="ts">

   export let lease: {
      leaseId: string;
      customerId: string;
      employeeId: string;
      contactInfoId: string;
      unitNum: string;
      price: number;
      leaseCreatedAt: Date;
      leaseReturnedAt: Date | null;
      leaseEffectiveDate: Date;
      leaseEnded: Date | null;
   }
</script>
<div class="card p-4">
   <span>
      <h3>Unit Number: {lease.unitNum.replace(/^0+/gm,'')}</h3>
      <h4>Price: ${lease.price}</h4>
   </span>
   <p>Lease effective Date: {lease.leaseEffectiveDate.getMonth()}/{lease.leaseEffectiveDate.getDate()}/{lease.leaseEffectiveDate.getFullYear()}</p>
   {#if lease.leaseEnded}
      <p>Lease ended: {lease.leaseEnded.getMonth()}/{lease.leaseEnded.getDate()}/{lease.leaseEnded.getFullYear()}</p>
   {/if}   
   <form action="/units/newlease">
      <input type="hidden" value={lease.customerId}>
      <button>Add new lease</button>
   </form>
</div>