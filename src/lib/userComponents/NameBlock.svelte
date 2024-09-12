<script lang="ts">
   import type { PartialUser } from "$lib/server/partialTypes";
   export let nameBlock: PartialUser;
</script>

<div class="card p-4">
   <span>
      <h3 class="h3">{nameBlock.givenName} {nameBlock.familyName}</h3>
   </span>
   <span>
      <p>{nameBlock.email}</p>
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