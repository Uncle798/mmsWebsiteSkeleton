<script lang="ts">

   export let nameBlock: {
    id: string;
    createdAt: Date;
    updatedAt: Date | null;
    email: string | null;
    givenName: string | null;
    familyName: string | null;
    organizationName: string | null;
    emailVerified: Date | null;
    employee: boolean;
    admin: boolean;
    githubId: bigint | null;
    githubUsername: string | null;
}
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