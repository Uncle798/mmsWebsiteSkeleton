<script lang="ts">
   import { onMount } from 'svelte';
   import { superForm } from 'sveltekit-superforms';
   import { TelInput, normalizedCountries } from 'svelte-tel-input';
   import type { DetailedValue, CountryCode, E164Number } from 'svelte-tel-input/types';
	import TextInput from '$lib/formComponents/TextInput.svelte';
   import type { SuperValidated, Infer } from 'sveltekit-superforms/client';
   import type { AddressFormSchema } from '$lib/formSchemas/schemas';

   export let data: SuperValidated<Infer<AddressFormSchema>>;
   const { form, errors, constraints, message, enhance } = superForm(data, {
      onUpdate(event) {
      },
      onError(event) {
         console.error(event.result);
      },
   })
   const phoneOptions = { invalidateOnCountryChange: true }
   let selectedCountryPhone1:CountryCode = 'US'
   let selectedCountryPhone2:CountryCode = 'US'
   let detailedValue:DetailedValue = {} as DetailedValue;
   let isValid = false;

   let input:HTMLInputElement;
   onMount(() => {
   if (typeof window !== 'undefined') {
      import('@mapbox/search-js-web').then(({ config, autofill }) => {
         /* cspell:disable-next-line */
         config.accessToken = 'pk.eyJ1IjoiZXJpY2JyYW5zb24iLCJhIjoiY20wYjh6b29yMDE4dDJqb2sxc3ZjZHgzMyJ9.3kAYNtGfsqEPi8a3Zlvlzg';
         autofill({
         options: {
            country: 'us'
         }
         });
      }).catch((error) => {
         console.error('Error loading Mapbox Search JS:', error);
      });
   }
   });

</script>
   
<form method="post" action="/register/addressForm" class="modal-form border border-surface-500 p-4 space-y-4 rounded-container-token" use:enhance>

      <TextInput
         name="organizationName"
         label="Organization Name (optional)"
         bind:value={$form.organizationName}
         errors={$errors.organizationName}
         placeholder="US Forrest Service" 
      />
      <TextInput
         name="address1"
         label="Address Line 1"
         bind:value={$form.address1}
         errors={$errors.address1}
         placeholder="1700 Mill Road"
         autocomplete="address-line1"
      />
      <TextInput
         name="address2"
         label="Address Line 2 (optional)"
         bind:value={$form.address2}
         errors={$errors.address2}
         placeholder="Unit 1"
         autocomplete="address-line2"
      />  
      <div class="flex">
         <TextInput
            name="city"
            label="City"
            bind:value={$form.city}
            errors={$errors.city}
            placeholder="Moscow"
            autocomplete="address-level2"
         />
         <TextInput
            name="state"
            label="State"
            bind:value={$form.state}
            errors={$errors.state}
            placeholder="ID"
            autocomplete="address-level1"
         />
         <TextInput
            name="zip"
            label="Zip code"
            bind:value={$form.zip}
            errors={$errors.zip}
            placeholder="83843"
            autocomplete="postal-code"
         />
      </div>
      
      <label for="country">Country
         <select name="country" bind:value={$form.country} class="select" >
            {#each normalizedCountries as country (country.id)}
               {#if country.iso2 === 'US'}
                  <option value={country.iso2} selected={true} aria-selected>{country.name}</option>
               {:else}
                  <option value={country.iso2}>{country.name}</option>
               {/if}
            {/each}
         </select>
      </label>
         

      <div class="input-group input-group-divider grid-cols-[auto_1fr_auto]">
         <select
         class="country-select {!isValid && 'invalid'} "
         aria-label="Select Country for your primary phone"
         name="phoneNum1Country"
         bind:value={selectedCountryPhone1}
         >
         <option value={null} hidden={selectedCountryPhone1 !== null}>Please select</option>
         {#each normalizedCountries as country (country.id)}
         <option
         value={country.iso2}
         selected={country.iso2 === selectedCountryPhone1}
         aria-selected={country.iso2 === selectedCountryPhone1}
         >
         {country.iso2} (+{country.dialCode})
      </option>
      {/each}
   </select>
   <TelInput {phoneOptions}
      name='phoneNum1' 
      placeholder = "208 882 6564"
      bind:valid={isValid} 
      bind:country={selectedCountryPhone1} 
      bind:value={$form.phoneNum1} 
      bind:detailedValue  
      class=" {!isValid && 'invalid'} input" 
   />
   {#if $errors.phoneNum1}
      <span class="input-error">{$errors.phoneNum1}</span>
   {/if}
   </div>
   <div class="input-group input-group-divider grid-cols-[auto_1fr_auto]">
      <select
         class="country-select {!isValid && 'invalid'} "
         aria-label="Select Country for your secondary phone"
         name="phoneNum2Country"
         bind:value={selectedCountryPhone2}
      >
      <option value={null} hidden={selectedCountryPhone1 !== null}>Please select</option>
      {#each normalizedCountries as country (country.id)}
         <option
            value={country.iso2}
            selected={country.iso2 === selectedCountryPhone2}
            aria-selected={country.iso2 === selectedCountryPhone2}
         >
         {country.iso2} (+{country.dialCode})
         </option>
      {/each}
   </select>
   <TelInput {phoneOptions} 
   name="phoneNum2"
   placeholder= "208 882 6564"
   bind:valid={isValid} 
   bind:country={selectedCountryPhone2} 
   bind:value={$form.phoneNum2} 
   bind:detailedValue  
   class=" {!isValid && 'invalid'} input" 
   />
   {#if $errors.phoneNum2}
   <span class="input-error">{$errors.phoneNum2}</span>
   {/if}
   </div>
   <button class="btn button-positive">Submit new Address</button>
</form>