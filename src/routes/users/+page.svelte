
<script lang="ts">
   import type { PageData } from "./$types";
   import { PUBLIC_COMPANY_NAME } from '$env/static/public'
   import EmploymentConfirmModal from "$lib/userComponents/EmploymentConfirmModal.svelte";
	import { getModalStore, type ModalComponent, type ModalSettings } from "@skeletonlabs/skeleton";
	import type { PartialUser } from "$lib/server/partialTypes";
	import { page } from "$app/stores";
	import NameBlock from "$lib/userComponents/NameBlock.svelte";
	import { createSearchStore, searchHandler } from "$lib/stores/search";
	import Address from "$lib/userComponents/Address.svelte";
   export let data:PageData;
   const { searchUsers, contactInfos } = data
   const searchStore = createSearchStore(searchUsers);
   const unsubscribe = searchStore.subscribe((model) => searchHandler(model))
   const modalStore = getModalStore();
   const modalComponent: ModalComponent = {
      ref: EmploymentConfirmModal,
   }
   function modalFire(employee:boolean, admin: boolean, userId:string, givenName:string|null, familyName: string|null):void {
      const modal:ModalSettings = {
         type: 'component',
         component: modalComponent,
         title:'Are you sure you\'d like to change employment status',
         body:`of ${givenName} ${familyName}?`,
         meta: {
            employee,
            admin,
            userId,
         }
      }
      modalStore.trigger(modal);
   }
</script>

<svelte:head>
	<title>{PUBLIC_COMPANY_NAME} | All Users</title>
</svelte:head>
<div>
   <input type="search" name="search" id="search" placeholder="Search..." class="input" bind:value={$searchStore.search}/>
</div>

{#each $searchStore.filtered as user (user.id)}
   {@const addresses = contactInfos.filter((cI) => cI.userId === user.id)}
   <div class="flex">
      <NameBlock nameBlock = {user} />
      {#each addresses as address}
         <Address address={address} />
      {/each}
      <div class="card"><button on:click={()=>{modalFire(user.employee, user.admin, user.id, user.givenName, user.familyName)}}>Change employment status</button></div>
   </div>

{/each} 