<script lang="ts">
	import type { Lease } from "@prisma/client";


   export let lease: Lease
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
</div>