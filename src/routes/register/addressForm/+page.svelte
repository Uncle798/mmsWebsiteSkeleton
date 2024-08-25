<script lang="ts">
   import { superForm } from 'sveltekit-superforms';
   import { TelInput, normalizedCountries } from 'svelte-tel-input';
   import type { DetailedValue, CountryCode, E164Number } from 'svelte-tel-input/types';
   import type { PageData } from './$types';
   
   export let data: PageData;
   const { form, errors, constraints, message, enhance } = superForm(data.form)

   const phoneOptions = { invalidateOnCountryChange: true}
   let selectedCountryPhone1:CountryCode = 'US'
   let selectedCountryPhone2:CountryCode = 'US'
   let detailedValue:DetailedValue = {} as DetailedValue;
   let isValid = false;
</script>
<form method="post" use:enhance>
   <label for="address1" class="Label">Address line 1</label>
   <input type="text" 
      class="input"
      name="address1"
      id="address1"
      placeholder="1500 Mill Road" 
      aria-invalid={$errors.address1 ? true : undefined}
      bind:value={$form.address1}
      {...$constraints.address1}
   />
   <label for="address2" class="Label">Address line 2</label>
   <input type="text" 
      class="input"
      name="address2"
      id="address2"
      placeholder="Unit 1" 
      aria-invalid={$errors.address2 ? true : undefined}
      bind:value={$form.address2}
      {...$constraints.address2}
   />
   <label for="address3" class="Label">Address line 3</label>
   <input type="text" 
      class="input"
      name="address3"
      id="address3"
      placeholder="C/O Smokey the Bear" 
      aria-invalid={$errors.address3 ? true : undefined}
      bind:value={$form.address3}
      {...$constraints.address3}
   />
   <div class="card">
      <label for="city" class="label">City

         <input type="text"
         class="input col-span-1"
         name="city"
         id="city"
         placeholder="Moscow"
         aria-invalid={$errors.city ? true : undefined}
         bind:value={$form.city}
         {...$constraints.city}
         />
      </label>
      <label for="state" class="label">State

         <input type="text"
         class="input col-span-2"
         name="state"
         id="state"
         placeholder="ID"
         aria-invalid={$errors.state ? true : undefined}
         bind:value={$form.state}
         {...$constraints.state}
         />
      </label>
      <label for="zip" class="label">Zip code
         
         <input type="text"
         class="input"
         name="zip"
         id="zip"
         placeholder="83843"
         aria-invalid={$errors.zip ? true : undefined}
         bind:value={$form.zip}
         {...$constraints.zip}
         />
      </label>
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
      bind:valid={isValid} 
      bind:country={selectedCountryPhone1} 
      bind:value={$form.phoneNum1} 
      bind:detailedValue  
      class=" {!isValid && 'invalid'} input" 
   />
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
      bind:valid={isValid} 
      bind:country={selectedCountryPhone2} 
      bind:value={$form.phoneNum2} 
      bind:detailedValue  
      class=" {!isValid && 'invalid'} input" 
   />
   </div>
   <button class="btn">Submit</button>
</form>