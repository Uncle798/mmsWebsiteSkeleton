<script lang="ts">
   import { Prisma, type User } from 'prisma/prisma-client'
   const partialUser = Prisma.validator<Prisma.UserDefaultArgs>()({
      select:{ 
         email: true, 
         givenName: true, 
         familyName: true, 
         organizationName: true }
   })
   export let nameBlock: typeof partialUser;
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