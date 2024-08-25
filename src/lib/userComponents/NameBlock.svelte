<script lang="ts">
   import { Prisma } from '@prisma/client';
   export const NameBlock = Prisma.validator<Prisma.UserDefaultArgs>()({
      select:{
         familyName: true,
         givenName: true,
         email: true,
         id: true
      }
   });
   export const nameBlock:typeof NameBlock = {} as typeof NameBlock;
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