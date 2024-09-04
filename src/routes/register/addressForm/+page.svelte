<script lang="ts">
   // @ts-ignore: it works
   import { PUBLIC_COMPANY_NAME } from '$env/static/public'
   import { onMount } from 'svelte';
   import { superForm } from 'sveltekit-superforms';
   import { TelInput, normalizedCountries } from 'svelte-tel-input';
   import type { DetailedValue, CountryCode, E164Number } from 'svelte-tel-input/types';
   import type { PageData } from './$types'; 

   export let data: PageData;
   const { form, errors, constraints, message, enhance } = superForm(data.form)
   
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

<svelte:head>
	<title>{PUBLIC_COMPANY_NAME} | Enter your Address</title>
</svelte:head>

<form method="post" use:enhance>
   <label for="address1" class="Label">Address line 1</label>
   <input type="text" 
      class="input"
      name="address1"
      id="address1"
      autocomplete="address-line1"
      placeholder="1700 Mill Road"
      aria-invalid={$errors.address1 ? true : undefined}
      bind:value={$form.address1}
      {...$constraints.address1}
   />
   {#if $errors.address1}
      <span class="input-error">{$errors.address1}</span>
   {/if}
   <label for="address2" class="Label">Address line 2</label>
   <input type="text" 
   class="input"
   name="address2"
   id="address2"
   autocomplete="address-line2"
   placeholder="Unit 1" 
   aria-invalid={$errors.address2 ? true : undefined}
   bind:value={$form.address2}
   {...$constraints.address2}
   />
   {#if $errors.address2}
      <span class="input-error">{$errors.address2}</span>
   {/if}
   <label for="address3" class="Label">Address line 3</label>
   <input type="text" 
   class="input"
   name="address3"
   id="address3"
   autocomplete="address-line3"
   placeholder="C/O Smokey the Bear" 
   aria-invalid={$errors.address3 ? true : undefined}
   bind:value={$form.address3}
   {...$constraints.address3}
   />
   {#if $errors.address3}
      <span class="input-error">{$errors.address3}</span>
   {/if}
   <div class="card flex">
      <label for="city" class="label">City
         
         <input type="text"
         class="input col-span-1"
         name="city"
         id="city"
         autocomplete="address-level2"
         placeholder="Moscow"
         aria-invalid={$errors.city ? true : undefined}
         bind:value={$form.city}
         {...$constraints.city}
         />
      </label>
      {#if $errors.city}
         <span class="input-error">{$errors.city}</span>
      {/if}
      <label for="state" class="label">State
         
         <input type="text"
         class="input col-span-2"
         name="state"
         id="state"
         autocomplete="address-level1"
         placeholder="ID"
         aria-invalid={$errors.state ? true : undefined}
         bind:value={$form.state}
         {...$constraints.state}
         />
      </label>
      {#if $errors.state}
         <span class="input-error">{$errors.state}</span>
      {/if}
      <label for="zip" class="label">Zip code
         
         <input type="text"
         class="input"
         name="zip"
         id="zip"
         autocomplete="postal-code"
         placeholder="83843"
         aria-invalid={$errors.zip ? true : undefined}
         bind:value={$form.zip}
         {...$constraints.zip}
         />
      </label>
      {#if $errors.zip}
         <span class="input-error">{$errors.zip}</span>
      {/if}
   </div>
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
<button class="btn">Submit</button>
</form>