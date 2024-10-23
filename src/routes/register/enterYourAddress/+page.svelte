<script lang="ts">
   // @ts-ignore: it works
   import { PUBLIC_COMPANY_NAME } from '$env/static/public'
   import type { PageData } from './$types';
	import AddressForm from '$lib/forms/AddressForm.svelte';
   import NameForm from '$lib/forms/NameForm.svelte';
   export let data:PageData;
</script>

<svelte:head>
	<title>{PUBLIC_COMPANY_NAME} | Enter your Address</title>
</svelte:head>

<AddressForm data={data.addressForm}/>