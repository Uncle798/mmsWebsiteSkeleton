<script lang="ts">
   import NameBlock from '$lib/userComponents/NameBlock.svelte';
import type { PageData } from './$types';
   
   export let data: PageData;
</script>

{#each data.users as user}
   <NameBlock nameBlock={user} />
{/each}