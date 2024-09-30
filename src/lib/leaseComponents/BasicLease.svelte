<script lang="ts">
	import type { PartialUser } from "$lib/server/partialTypes";
	import type { Lease } from "@prisma/client";
   export let lease: Lease;
   export let customer: PartialUser;
</script>
<div class="card p-4">
   <span>
      <h3>Unit Number: <a href="/units/{lease.unitNum}"> {lease.unitNum.replace(/^0+/gm,'')}</a></h3>
      <h4>Price: ${lease.price}</h4>
   </span>
   <p>Lease effective Date: {lease.leaseEffectiveDate.getMonth()}/{lease.leaseEffectiveDate.getDate()}/{lease.leaseEffectiveDate.getFullYear()}</p>
   {#if lease.leaseEnded}
      <p>Lease ended: {lease.leaseEnded.getMonth()}/{lease.leaseEnded.getDate()}/{lease.leaseEnded.getFullYear()}</p>
   {/if}   
</div>