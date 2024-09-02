<script lang="ts">
   import type { PageData } from "./$types";
   export let data: PageData;
</script>

<svelte:head>
	<title>{process.env.COMPANY_NAME} | Home</title>
</svelte:head>

<h1>{process.env.COMPANY_NAME}</h1>
{#if data.user}
   You're logged in
{/if}