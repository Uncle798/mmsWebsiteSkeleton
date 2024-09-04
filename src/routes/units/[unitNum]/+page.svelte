<script lang="ts">
   import { PUBLIC_COMPANY_NAME } from '$env/static/public'
   export let data
</script>

<svelte:head>
	<title>{PUBLIC_COMPANY_NAME} | Unit: {data.unit.num.replace(/^0+/gm, '')}</title>
</svelte:head>

<h1>Unit: {data.unit.num.replace(/^0+/gm, '')}</h1>
<h2>Size: {data.unit.size}</h2>
<h2>Advertised price: ${data.unitPrice?.price}</h2>
<h3>Building: {data.unit.building}</h3>