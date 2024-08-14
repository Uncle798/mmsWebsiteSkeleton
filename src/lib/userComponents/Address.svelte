<script lang="ts">

   export let address : {
      contactId: string,
      email: string;
      address1: string;
      address2: string | null;
      address3: string | null;
      city: string;
      state: string;
      zip: string;
      phoneNum1: string;
      phoneNum2: string | null;
      phoneNum1Validated: boolean;
      phoneNum2Validated: boolean | null;
      softDelete: boolean;
   }
</script>

<div class="card p-4">
   <p>{address.address1}</p>
   {#if address.address2}
      <p>{address.address2}</p>
   {/if}
   {#if address.address3}
      <p>{address.address3}</p>
   {/if}
   <p>{address.city}, {address.state}, {address.zip}</p>
</div>