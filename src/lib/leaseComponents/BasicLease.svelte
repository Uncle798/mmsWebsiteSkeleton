<script lang="ts">
	import type { PartialUser } from "$lib/server/partialTypes";
	import Address from "$lib/userComponents/Address.svelte";
	import NameBlock from "$lib/userComponents/NameBlock.svelte";
	import type { Lease } from "@prisma/client";
	import dayjs from "dayjs";
   export let lease: Lease;
</script>
<div class="card p-4">
   <span>
      <h3 class="h3">Unit Number: <a href="/units/{lease.unitNum}"> {lease.unitNum.replace(/^0+/gm,'')}</a></h3>
      <h4 class="h4">Price: ${lease.price}</h4>
   </span>
   <p>Lease effective Date: {dayjs(lease.leaseEffectiveDate).format('M/D/YYYY')}</p>
   {#if lease.leaseEnded}
      <p>Lease ended: {dayjs(lease.leaseEnded).format('M/D/YYYY')}</p>
   {/if}
</div>