<script lang="ts"> 
   import type { Pricing, Unit } from "@prisma/client";
   import type { PriceCount } from "$lib/server/partialTypes";
   export let pricing:PriceCount;
</script>
<div class="card">
   <p>Size: {pricing.size.replace(/^0+/gm, '').replace(/x0/gm,'x')}</p>
   <p>Price: ${pricing.price}</p>
   <p>Start Date: {pricing.startDate.getMonth()}/{pricing.startDate.getDate()}/{pricing.startDate.getFullYear()}</p>
   {#if pricing.notes}
      <p>Notes: {pricing.notes}</p>
   {/if}
   <p>Number of Units at this price: {pricing.count}</p>
</div>