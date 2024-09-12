
<script lang="ts">
   import type { PageData } from "./$types";
   // @ts-ignore: it works
   import { PUBLIC_COMPANY_NAME } from '$env/static/public'
   import EmploymentConfirmModal from "$lib/userComponents/EmploymentConfirmModal.svelte";
	import { getModalStore, type ModalComponent, type ModalSettings } from "@skeletonlabs/skeleton";
	import type { PartialUser } from "$lib/server/partialTypes";
	import { page } from "$app/stores";
	import NameBlock from "$lib/userComponents/NameBlock.svelte";
   export let data:PageData;
   const modalStore = getModalStore();
   const modalComponent: ModalComponent = {
      ref: EmploymentConfirmModal,
   }
   function modalFire(employee:boolean, admin: boolean, userId:string, givenName:string|null, familyName: string|null):void {
      const modal:ModalSettings = {
         type: 'component',
         component: modalComponent,
         title:'Are you sure you\'d like to change employment status?',
         body:`of ${givenName} ${familyName}`,
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
{#each data.users as user}
<div class="flex">
   <NameBlock nameBlock = {user} />
   <div class="card"><button on:click={()=>{modalFire(user.employee, user.admin, user.id, user.givenName, user.familyName)}}>Change employment status</button></div>
</div>

{/each} 