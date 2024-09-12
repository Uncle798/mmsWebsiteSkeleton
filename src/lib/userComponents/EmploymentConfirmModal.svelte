<script lang="ts">
   import { getModalStore } from "@skeletonlabs/skeleton";
   import { superForm } from "sveltekit-superforms";
   import SuperDebug from "sveltekit-superforms";
   import type { SvelteComponent } from "svelte";
   import { page } from "$app/stores";

   export let parent: SvelteComponent;
   const modalStore = getModalStore();
   const { form, errors, constraints, message, formId, enhance } = superForm($page.data.form,{
      onUpdate(event) {
         modalStore.close();
      },
      onError(event) {
         console.error(event.result);
      },
      onSubmit({formData}){
         formData.set('userId', $modalStore[0].meta.userId)
         modalStore.close();
      }
   });
</script>

<SuperDebug data={$form} />

{#if $modalStore[0]}
   <div class="card p-4 w-modal shadow-xl space-y-4">
      <header class="text-2xl font-bold">{$modalStore[0].title ?? 'Title missing'}</header>
      <article>{$modalStore[0].body ?? 'Body missing'}</article>
      <form method="post" class="modal-form border border-surface-500 p-4 space-y-4 rounded-container-token" use:enhance>
         <label for="employee"><span>Employee</span>
            <input type="checkbox" name="employee" id="employee" bind:checked={$form.employee} {...$constraints.employee}/>
         </label>
         {#if $errors.employee}
            {$errors.employee}
         {/if}
         <label for="admin"><span>Admin</span>
            <input type="checkbox" name="admin" id="admin" bind:checked={$form.admin} {...$constraints.admin}/>
         </label>
         {#if $errors.employee}
            {$errors.admin}
         {/if}
         <input type="hidden" name="userId" id="userId" value={$modalStore[0].meta.userId} {...$constraints.userId}/>
      </form>
      <footer class="modal-footer {parent.regionFooter}">
         <button class="btn {parent.buttonNeutral}" on:click={parent.$onClose}>{parent.buttonTextCancel}</button>
         <button class="btn {parent.buttonPositive}">{parent.buttonTextSubmit}</button>
      </footer>
   </div>
{/if}