<script lang="ts">
   import type { Unit } from 'prisma/prisma-client'
   interface Props {
      unit: Unit;
   }

   let { unit }: Props = $props();
</script>

<div class="card p-4">
   <h3>Unit: {unit.num.replace(/^0+/gm,'')}</h3>
   <p>Building: {unit.building}</p>
   <p>Size: {unit.size.replace(/^0+/gm,'').replace(/x0/gm,'x')}</p>
   <p>Price: ${unit.advertisedPrice} per month</p>
   <p>Deposit: ${unit.advertisedPrice}</p>
</div>