<script lang="ts">
   import type { PageData } from "./$types";
   export let data: PageData;
</script>

<svelte:head>
	<title>Moscow Mini Storage | Home</title>
</svelte:head>

<h1>Moscow Mini Storage</h1>
{#if data.user}
   You're logged in
{/if}