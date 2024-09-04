<script lang="ts">
   import type { PartialUser } from "$lib/server/partialTypes";
   export let nameBlock: PartialUser;
</script>

<div class="card p-4">
   <span>
      <h3>{nameBlock.givenName} {nameBlock.familyName}</h3>
   </span>
   <span>
      <h4>{nameBlock.email}</h4>
      {#if nameBlock.organizationName}
         <p>{nameBlock.organizationName}</p>
      {/if}
   </span>
</div>