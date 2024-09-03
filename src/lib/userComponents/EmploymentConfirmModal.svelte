<script lang="ts">
   import { getModalStore } from "@skeletonlabs/skeleton";
   import { superForm } from "sveltekit-superforms";
	import type { PageData } from "../../routes/$types";
   import type { SvelteComponent } from "svelte";

   export let parent: SvelteComponent;
   const modalStore = getModalStore();
   export let formData;
   const { form, errors, constraints, message, formId, enhance } = superForm(formData);
   function onFormSubmit(): void {
      if($modalStore[0].response) {
         $modalStore[0].response($form.data);
         modalStore.close();
      }
   }
</script>

{#if $modalStore[0]}
   <div class="card p-4 w-modal shadow-xl space-y-4">
      <header class="text-2xl font-bold">{$modalStore[0].title ?? 'Title missing'}</header>
      <article>{$modalStore[0].body ?? 'Body missing'}</article>
      <form action="/employee" method="post" class="modal-form border border-surface-500 p-4 space-y-4 rounded-container-token" use:enhance>
         <label for="employee"><span>Employee</span>
            <input type="checkbox" name="employee" id="employee" checked={$form.employee}/>
         </label>
         <label for="admin"><span>Admin</span>
            <input type="checkbox" name="admin" id="id" checked={$form.admin}/>
         </label>
      </form>
      <footer class="modal-footer {parent.regionFooter}">
         <button class="btn {parent.buttonNeutral}" on:click={parent.$onClose}>{parent.buttonTextCancel}</button>
         <button class="btn {parent.buttonPositive}" on:click={onFormSubmit}>{parent.buttonTextSubmit}</button>
      </footer>
   </div>
{/if}