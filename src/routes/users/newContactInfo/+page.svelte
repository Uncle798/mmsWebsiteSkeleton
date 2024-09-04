<script lang="ts">
    import type { PageData } from './$types';
    import { PUBLIC_COMPANY_NAME } from '$env/static/public'
    import type { ContactInfo, User } from '@prisma/client';
    import Address from '$lib/userComponents/Address.svelte';
    import NameBlock from '$lib/userComponents/NameBlock.svelte';
    export let data: PageData;
    export const dbUser:User = data.dbUser!
    export const contactInfos:ContactInfo = data.contactInfos!
</script>

<svelte:head>
	<title>{PUBLIC_COMPANY_NAME} | Home</title>
</svelte:head>

<NameBlock nameBlock={dbUser} />

{#each contactInfos as info }   
   <Address address={info}/>
{/each}