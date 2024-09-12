<script lang="ts">
   import { getModalStore } from "@skeletonlabs/skeleton";
   import { superForm } from "sveltekit-superforms";
   import SuperDebug from "sveltekit-superforms";
   import type { SvelteComponent } from "svelte";
   import { page } from "$app/stores";

   export let parent: SvelteComponent;
   const modalStore = getModalStore();
   const { form:employeeForm, errors:employeeErrors, constraints, message, formId, enhance } = superForm($page.data.employeeForm,{
      onUpdate(event) {
         modalStore.close();
      },
      onError(event) {
         console.error(event.result);
      },
      onSubmit({formData}){
         console.log({formData});
         formData.set('userId', $modalStore[0].meta.userId)
         modalStore.close();
      },
      resetForm: true,
   });
   const {form: adminForm, errors: adminErrors} = superForm($page.data.adminForm, {
      onUpdate(event) {
         modalStore.close();
      },
      onError(event) {
         console.error(event.result);
      },
      onSubmit({formData}){
         console.log({formData});
         formData.set('userId', $modalStore[0].meta.userId)
         modalStore.close();
      },
      resetForm: true,
   })
   function onClose(){
      modalStore.close();
   }
</script>


{#if $modalStore[0]}
   <div class="card p-4 w-modal shadow-xl space-y-4">
      <header class="text-2xl font-bold">{$modalStore[0].title ?? 'Title missing'}</header>
      <article>{$modalStore[0].body ?? 'Body missing'}</article>
      <form method="post" action=?/changeEmployeeStatus class="modal-form border border-surface-500 p-4 space-y-4 rounded-container-token" use:enhance>
            <button class="btn">
               {#if $modalStore[0].meta.employee}
                  Remove Employee Status
                  {:else}
                  Add Employee Status
               {/if}
            </button>
            <input type="hidden" name="userId" id="userId" value={$modalStore[0].meta.userId} {...$constraints.userId}/>
      </form>

      <form method="post" action=?/changeAdminStatus class="modal-form border border-surface-500 p-4 space-y-4 rounded-container-token" use:enhance>
         <button class="btn">
            {#if $modalStore[0].meta.admin}
               Remove Admin status
               {:else}
               Add Admin status
            {/if}
         </button>
         <input type="hidden" name="userId" id="userId" value={$modalStore[0].meta.userId} {...$constraints.userId}/>
      </form>
      <button class="btn {parent.buttonNeutral}" on:click={onClose}>{parent.buttonTextCancel}</button>
   </div>
{/if}