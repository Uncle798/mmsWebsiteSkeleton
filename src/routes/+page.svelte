<script lang="ts">
   import type { PageData } from "./$types";
   export let data: PageData;
</script>

<h1>Moscow Mini Storage</h1>
{#if data.user}
   You're logged in
{/if}