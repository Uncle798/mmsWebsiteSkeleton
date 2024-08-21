<script lang="ts">
   import { superForm } from 'sveltekit-superforms';
   import { TelInput, normalizedCountries } from 'svelte-tel-input';
   import type { DetailedValue, CountryCode, E164Number } from 'svelte-tel-input/types';
   import type { PageData } from './$types';
   
   export let data: PageData;
   const { form, errors, constraints, message, enhance } = superForm(data.form)

   const phoneOptions = { invalidateOnCountryChange: true}
   let selectedCountry:CountryCode = 'US'
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
   <div class="input-group input-group-divider grid-cols-[auto_1fr_auto]">
      <label for="city" class="label">City

         <input type="text"
         class="input"
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
         class="input"
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
         aria-label="Default select example"
         name="Country"
         bind:value={selectedCountry}
	   >
		<option value={null} hidden={selectedCountry !== null}>Please select</option>
		{#each normalizedCountries as country (country.id)}
			<option
				value={country.iso2}
				selected={country.iso2 === selectedCountry}
				aria-selected={country.iso2 === selectedCountry}
			>
				{country.iso2} (+{country.dialCode})
			</option>
		{/each}
	</select>
   <TelInput {phoneOptions} 
      bind:valid={isValid} 
      bind:country={selectedCountry} 
      bind:value={$form.phoneNum} 
      bind:detailedValue  
      class=" {!isValid && 'invalid'} input" 
   />
   </div>
   <button class="btn">Submit</button>
</form>