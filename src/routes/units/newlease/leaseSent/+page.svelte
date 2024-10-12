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

<h1 class="h1">Lease Sent!</h1>
<h3 class="h3">Please check {data.user?.email} for an email from {PUBLIC_ANVIL_EMAIL} and sign the attached lease</h3>
<p class="p">Leases are signed after both you and a representative of { PUBLIC_COMPANY_NAME } have signed it. {PUBLIC_COMPANY_NAME} will sign contracts 
   during business hours, and you'll be notified and sent a copy of the finalized contract. {PUBLIC_COMPANY_NAME} does not provide locks,
   you must provide your own. 
</p>

<pre class="pre">{JSON.stringify(data.packetDetails, null, 2)}</pre>