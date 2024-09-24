<script lang="ts"> 
   import type { Lease, Unit } from "@prisma/client";
	import { SlideToggle } from "@skeletonlabs/skeleton";
   import { superForm } from "sveltekit-superforms";
   import type { SuperValidated, Infer } from "sveltekit-superforms/client";
   import { page } from "$app/stores";
	import type { UnitComponentSchema } from "../../routes/units/proxy+page.server";
   export let unit:Unit;
   export let lease:Lease|undefined;
   export let data: SuperValidated<Infer<UnitComponentSchema>>;
   const { form, enhance,  } = superForm(data, {
      onUpdate(event) {
         console.log(event.form.data)
      },
   });
</script>
<div class="card">
   <h2 class="h2">{unit.num.replace(/^0+/gm, '')}</h2>
   <p>Size: {unit.size.replace(/^0+/gm, '').replace(/x0/gm,'x')}</p>
   <p>Advertised price: ${unit.advertisedPrice}</p>
   {#if lease}
      <p>Lease Price: ${lease.price}</p>
      <p>Lease Start Date: {lease.leaseEffectiveDate.getMonth()}/{lease.leaseEffectiveDate.getDate()}/{lease.leaseEffectiveDate.getFullYear()}</p>
   {/if}
   <form action="?/unitComponentForm" method="post" use:enhance>
      <p>Notes: <textarea class="textarea" name="notes" rows="4" placeholder={unit.notes} bind:value={$form.notes}/></p>
      <SlideToggle name="unavailable" checked={unit.unavailable}>Unit unavailable</SlideToggle>
      <input type="hidden" name="unitNum" id="unitNum" value={unit.num}>
      <button>Update</button>
   </form>
</div>