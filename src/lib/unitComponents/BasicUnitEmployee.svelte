<script lang="ts"> 
   import type { Lease, Unit, ContactInfo } from "@prisma/client";
	import { SlideToggle } from "@skeletonlabs/skeleton";
   import { superForm } from "sveltekit-superforms";
   import type { SuperValidated, Infer } from "sveltekit-superforms/client";
   import { page } from "$app/stores";
	import type { UnitComponentSchema } from "../../routes/units/proxy+page.server";
   import dayjs from "dayjs";
   export let unit:Unit;
   export let lease:Lease|undefined;
   export let data: SuperValidated<Infer<UnitComponentSchema>>;
   const today = new Date();
   const { form, enhance,  } = superForm(data, {
      onUpdate(event) {
      },
      onError(event){
         console.error(event.result)
      }
   });
</script>
<div class="card">
   <h2 class="h2"><a href="units/{unit.num}">{unit.num.replace(/^0+/gm, '')}</a></h2>
   <p>Size: {unit.size.replace(/^0+/gm, '').replace(/x0/gm,'x')}</p>
   <p>Advertised price: ${unit.advertisedPrice}</p>
   {#if lease}
   <div>
      <p>Lease Price: ${lease.price}</p>
      <p>Lease Start Date: {lease.leaseEffectiveDate.getMonth()+1}/{lease.leaseEffectiveDate.getDate()}/{lease.leaseEffectiveDate.getFullYear()}</p>
      <p>Lease length: {dayjs(today).diff(lease.leaseEffectiveDate, 'months')} months</p>
   </div>
   <form action="?/endLease" method="post" use:enhance>
      <input type="hidden" name="leaseId" id="leaseID" value={lease.leaseId}>
      <button class="btn">End lease</button>
   </form>
   {/if}
</div>

<div>
   <form action="?/unitComponentForm" method="post" use:enhance>
      <p>Notes: <textarea class="textarea" name="notes" rows="4" placeholder={unit.notes} bind:value={$form.notes}/></p>
      <SlideToggle name="unavailable" checked={unit.unavailable}>Unit unavailable</SlideToggle>
      <input type="hidden" name="unitNum" id="unitNum" value={unit.num}>
      <button>Update</button>
   </form>
</div>