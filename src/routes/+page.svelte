<script lang="ts">
   // @ts-ignore: it works
   import { PUBLIC_COMPANY_NAME } from '$env/static/public'
   import type { PageData } from "./$types";

   interface Props {
      data: PageData;
   }

   let { data }: Props = $props();
</script>

<svelte:head>
	<title>{PUBLIC_COMPANY_NAME} | Home</title>
</svelte:head>

<h1>{PUBLIC_COMPANY_NAME}</h1>
{#if data.user}
   You're logged in
{/if}