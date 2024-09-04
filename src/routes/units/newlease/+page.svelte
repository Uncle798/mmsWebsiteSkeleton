<script lang="ts">
   // @ts-ignore: it works
   import { PUBLIC_COMPANY_NAME } from '$env/static/public'
   import type { UnitPricing } from '@prisma/client'
	import { superForm } from "sveltekit-superforms";
   import { Autocomplete } from '@skeletonlabs/skeleton';
   import type {AutocompleteOption} from '@skeletonlabs/skeleton'
   import { userId } from './store'
	import NameBlock from '$lib/userComponents/NameBlock.svelte';
	export let data

	const { form, errors, constraints, message, enhance } = superForm(data.form)
</script>

<svelte:head>
	<title>{PUBLIC_COMPANY_NAME} | Admin New Lease</title>
</svelte:head>

{#if $message}
	<h3>{$message}</h3>
{/if}
{#if data.user}
<NameBlock nameBlock={data.user} />
{/if}