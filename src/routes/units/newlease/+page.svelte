<script lang="ts">
   import type { UnitPricing } from '@prisma/client'
	import { superForm } from "sveltekit-superforms";
   import { Autocomplete } from '@skeletonlabs/skeleton';
   import type {AutocompleteOption} from '@skeletonlabs/skeleton'
   import { userId } from './store'
	export let data
   export let { units, users } = data;
   export let unitSelection = '';
   export const unitNumOptions:AutocompleteOption<string>[] = [];
   units.forEach((unit) =>{
         const label = unit.unitNum.replace(/^0+/gm,'');
         const value = unit.unitPricingId;
         const option: AutocompleteOption<string> = {
            label,
            value
         }
         unitNumOptions.push(option);
   })
   function onUnitSelection(event: CustomEvent<AutocompleteOption<string>>): void {
      unitSelection = event.detail.label;
   }

   export let userEmailSelection = '';
   export let userNameSelection = '';
   export let userNameDenyList: string[] =[];
   export let userEmailDenyList: string[] =[];
   const userOptions:AutocompleteOption<string>[] = [];
   const userEmailOptions:AutocompleteOption<string>[] = [];
   users.forEach((user)=>{
      const nameLabel = user.familyName + ', ' + user.givenName;
      const emailLabel = user.email;
      const value = user.id;
      const nameOption: AutocompleteOption<string> = {
         label:nameLabel,
         value
      }
      const emailOption: AutocompleteOption<string> = {
         label:emailLabel!,
         value
      }
      userOptions.push(nameOption);
      userEmailOptions.push(emailOption);
   });
   function onUserSelection(event: CustomEvent<AutocompleteOption<string>>): void {
      userNameSelection = event.detail.label;
      userEmailDenyList.push(event.detail.value);
   }
   function onEmailSelection(event: CustomEvent<AutocompleteOption<string>>): void {
      userEmailSelection = event.detail.label;
      userNameDenyList.push(event.detail.value)
   }
   function clearSearch()=>{
      userEmailDenyList.
   }
	const { form, errors, constraints, message, enhance } = superForm(data.form)
</script>


{#if $message}
	<h3>{$message}</h3>
{/if}

<form method="post">
   <li>
      <div class="float-start">
         <label for="unitNum">Unit number:</label>
         <input class="input" type="search" name="unitNum" bind:value={unitSelection} placeholder="Search" />
         <div class="card  max-w-sm max-h-48 p-4 overflow-y-auto " >
            <Autocomplete bind:input={unitSelection} 
            options={unitNumOptions} 
            on:selection={onUnitSelection} 
            emptyState="No available units"
            />
         </div>
      </div>
      
      <div class="float-left w-1/6">
         <label for="userSelection">User:</label>
         <input class="input" type="search" name="userSelection" bind:value={userNameSelection} placeholder="Search" />
         <div class="card max-w-sm max-h-48 p-4 overflow-y-auto float-left" >
            <Autocomplete bind:input={userNameSelection} 
            options={userOptions} 
            on:selection={onUserSelection} 
            emptyState="No registered users"
            />
         </div>
      </div>
   </li>
   </form>