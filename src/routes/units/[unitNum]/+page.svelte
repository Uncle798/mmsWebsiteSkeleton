<script lang="ts">
   export let data
</script>

<h1>Unit: {data.unit.num.replace(/^0+/gm, '')}</h1>
<h2>Size: {data.unit.size}</h2>
<h2>Advertised price: ${data.unitPrice?.price}</h2>
<h3>Building: {data.unit.building}</h3>