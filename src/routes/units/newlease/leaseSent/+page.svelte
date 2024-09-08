<script lang="ts">
   // @ts-ignore: it works
   import { PUBLIC_COMPANY_NAME, PUBLIC_ANVIL_EMAIL } from '$env/static/public';   
   // @ts-ignore: it works
   import type { PageData } from './$types';
	export let data:PageData;
</script>

<svelte:head>
	<title>{PUBLIC_COMPANY_NAME} | Lease Sent!</title>
</svelte:head>

<h1>Lease Sent!</h1>
<h3>Please check {data.user?.email} for an email from {PUBLIC_ANVIL_EMAIL} and sign the attached lease</h3>