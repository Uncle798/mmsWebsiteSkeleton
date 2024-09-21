<script lang="ts"> 
   import type { Lease, Unit } from "@prisma/client";
   export let unit:Unit;
   export let lease:Lease
</script>
<div class="card">
   <p>Size: {unit.size.replace(/^0+/gm, '').replace(/x0/gm,'x')}</p>
   <p>Price: ${unit.price}</p>
   {#if lease}
      <p>Start Date: {lease.leaseEffectiveDate.getMonth()}/{lease.leaseEffectiveDate.getDate()}/{lease.leaseEffectiveDate.getFullYear()}</p>
   {/if}
   {#if unit.notes}
      <p>Notes: {unit.notes}</p>
   {/if}
</div>