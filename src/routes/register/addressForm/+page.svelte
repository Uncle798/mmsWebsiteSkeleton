<script lang="ts">
   // @ts-ignore: it works
   import { PUBLIC_COMPANY_NAME } from '$env/static/public'
   import type { PageData } from './$types';
	import AddressFormModal from '$lib/modals/AddressFormModal.svelte';
   export let data:PageData;
</script>

<svelte:head>
	<title>{PUBLIC_COMPANY_NAME} | Enter your Address</title>
</svelte:head>

<AddressFormModal data={data.addressForm}/>