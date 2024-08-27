<script lang="ts"> 
   import { superForm } from 'sveltekit-superforms';
   import type { PageData } from './$types';
   
   export let data: PageData;
   const { form, errors, constraints, message, enhance } = superForm(data.form);
</script>

<svelte:head>
	<title>Moscow Mini Storage | Available Units</title>
</svelte:head>

{#each data.availableUnits as unit}
<h1>Unit: {unit.unitNum.replace(/^0+/gm, '')}</h1>
<h2>Size: {unit.size}</h2>
<h2>Price: ${unit.price}</h2>
{/each}