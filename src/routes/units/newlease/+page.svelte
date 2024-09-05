<script lang="ts">
   // @ts-ignore: it works
   import { PUBLIC_COMPANY_NAME } from '$env/static/public'
	import { superForm } from "sveltekit-superforms";
	import NameBlock from '$lib/userComponents/NameBlock.svelte';
	import Address from '$lib/userComponents/Address.svelte';
	import BasicUnitCustomer from '$lib/unitComponenets/BasicUnitCustomer.svelte';
	
   import type { PageData } from './$types';
	export let data:PageData

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
{#if data.address}
   <Address address={data.address} />
{:else}
   <a class="a" href="/register/addressFrom">Please add your address</a>
{/if}
{#if data.unit && data.unitPrice}
   <BasicUnitCustomer unit={data.unit} pricing={data.unitPrice} />
{/if}

{#if data.user && data.address && data.unitPrice}
<form method="post">
   <button class="btn">All the above is correct, please email me a lease to sign</button>
</form>
{/if}