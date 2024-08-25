<script lang="ts">
   import NameBlock from "$lib/userComponents/NameBlock.svelte";
import type { PageData } from "../$types";
   import { DataHandler } from '@vincjo/datatables';

   export let data;
   const { employees } = data;
</script>


{#each employees as employee}
   <div class="card col-span-2">
      <NameBlock  nameBlock= {employee}/>
   </div>
{/each}