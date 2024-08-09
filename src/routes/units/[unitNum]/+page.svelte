<script lang="ts">
   export let data
   console.log(data)
</script>

<h1>Unit: {data.unit.num.replace(/^0+/gm, '')}</h1>
<h2>Size: {data.unit.size}</h2>
<h2>Advertised price: ${data.unitPrice?.price}</h2>
{#if data.currentLease?.id}
   <h2>Leased price: ${data.currentLease?.price}</h2>
{/if}
<h3>Building: {data.unit.building}</h3>