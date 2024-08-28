<script lang="ts">
    import type { PageData } from './$types';
    import type { ContactInfo, User } from '@prisma/client';
    import Address from '$lib/userComponents/Address.svelte';
    import NameBlock from '$lib/userComponents/NameBlock.svelte';
    export let data: PageData;
    export const dbUser:User = data.dbUser!
    export const contactInfos:ContactInfo = data.contactInfos!
</script>

<svelte:head>
	<title>Moscow Mini Storage | Home</title>
</svelte:head>

<NameBlock nameBlock={dbUser} />

{#each contactInfos as info }   
   <Address address={info}/>
{/each}