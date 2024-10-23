<script lang="ts">
   // @ts-ignore: it works
   import { PUBLIC_COMPANY_NAME } from '$env/static/public'
   interface Props {
      pageTitle: string;
   }

   let { pageTitle }: Props = $props();
</script>

<svelte:head>
   <title>{PUBLIC_COMPANY_NAME} | {pageTitle}</title>
</svelte:head>