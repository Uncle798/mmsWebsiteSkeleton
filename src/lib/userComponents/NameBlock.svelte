<script lang="ts">
   import type { PartialUser } from "$lib/server/partialTypes";
   interface Props {
      nameBlock: PartialUser;
   }

   let { nameBlock }: Props = $props();
</script>

<div class="card p-4">
   <span>
      <h3 class="h3"><a href="/users/{nameBlock.id}">{nameBlock.givenName} {nameBlock.familyName}</a></h3>
   </span>
   <span>
      <p><a href="/users/{nameBlock.id}">{nameBlock.email}</a></p>
      {#if nameBlock.organizationName}
         <p>{nameBlock.organizationName}</p>
      {/if}
      {#if nameBlock.employee}
        <p> <strong>Employee</strong></p>
      {/if}
      {#if nameBlock.admin}
         <p><strong>Admin</strong></p>
      {/if}
   </span>
</div>