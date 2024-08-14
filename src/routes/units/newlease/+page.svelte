<script lang="ts">
   import type { UnitPricing } from '@prisma/client'
	import { superForm } from "sveltekit-superforms";
   import { Autocomplete } from '@skeletonlabs/skeleton';
   import type {AutocompleteOption} from '@skeletonlabs/skeleton'
	export let data
   console.log(data)
   export const {units} = data;
	const { form, errors, constraints, message, enhance } = superForm(data.form)
</script>
{#if $message}
	<h3>{$message}</h3>
{/if}
<form method="post">
   <label for="unit number">Unit number:</label>
   
</form>