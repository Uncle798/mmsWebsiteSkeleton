<script lang="ts">
    import type { PageData } from './$types';
    // @ts-ignore: it works
    import { PUBLIC_COMPANY_NAME } from '$env/static/public'
    import type { ContactInfo, User } from '@prisma/client';
    import Address from '$lib/userComponents/Address.svelte';
    import NameBlock from '$lib/userComponents/NameBlock.svelte';
   interface Props {
      data: PageData;
   }

   let { data }: Props = $props();
    export const dbUser = data.dbUser!
    export const contactInfos = data.contactInfos!
</script>

<svelte:head>
	<title>{PUBLIC_COMPANY_NAME} | Home</title>
</svelte:head>

<NameBlock nameBlock={dbUser} />

{#each contactInfos as info }   
   <Address address={info}/>
{/each}