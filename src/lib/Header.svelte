<script lang="ts">
   // @ts-ignore: it works
   import { PUBLIC_COMPANY_NAME } from '$env/static/public'
   export let pageTitle:string;
</script>

<svelte:head>
   <title>{PUBLIC_COMPANY_NAME} | {pageTitle}</title>
</svelte:head>