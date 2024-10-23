<script lang="ts">
	// @ts-ignore: it works
	import { zxcvbn, zxcvbnOptions, type Score } from "@zxcvbn-ts/core";
	import * as zxcvbnCommonPackage from "@zxcvbn-ts/language-common";
	import * as zxcvbnEnPackage from "@zxcvbn-ts/language-en";
	import { superForm } from "sveltekit-superforms";
	import { getToastStore } from '@skeletonlabs/skeleton';
	import type { ToastSettings } from '@skeletonlabs/skeleton';
   import type { SuperValidated, Infer } from 'sveltekit-superforms/client';
   import type { registerFormSchema } from "$lib/formSchemas/schemas";
	import { getModalStore } from "@skeletonlabs/skeleton";
	import type { PageData } from "./$types";
	import EmailInput from "$lib/formComponents/EmailInput.svelte";
	import TextInput from "$lib/formComponents/TextInput.svelte";
	import PasswordInput from "$lib/formComponents/PasswordInput.svelte";
	
	export let data:PageData;
	let passwordTouched = false;
	const { translations } = zxcvbnEnPackage;
	const { adjacencyGraphs: graphs, dictionary: commonDictionary } = zxcvbnCommonPackage;
	const { dictionary: englishDictionary } = zxcvbnEnPackage;
	const options = {
		translations,
		graphs,
		dictionary: { ...commonDictionary, ...englishDictionary },
	};
	zxcvbnOptions.setOptions(options);
	const { form, errors, constraints, message, enhance } = superForm(data.registerForm)
	$: ({
	score,
	feedback: { warning, suggestions },
	} = zxcvbn($form.password));
	let strengthDescription = "Low";
	$: switch (score) {
	case 3:
		strengthDescription = "OK";
		break;
	case 4:
		strengthDescription = "Good";
		break;
	case 0:
	case 1:
	case 2:
	default:
		strengthDescription = "Low";
	}
</script>

{#if $message}
	<h3>{$message}</h3>
{/if}
<form method="POST" class="p-4 space-y-4 rounded-container-token" use:enhance>
	<div class="flex">

		<TextInput 
			label="Given Name"
			name="givenName"
			value={$form.givenName}
			errors={$errors.givenName}
			constraints={$constraints.givenName}
			placeholder="Smokey"
		/>
		<TextInput
			label="Family Name"
			name="familyName"
			value={$form.familyName}
			errors={$errors.familyName}
			constraints={$constraints.familyName}
			placeholder="Bear"
		/>
	</div>
	<EmailInput 
		label="Email",
		name="email"
		errors={$errors.email}
		constraints={$constraints.email}
		value={$form.email}
	/>
	<PasswordInput
		label="Password"
		name="password"
		autocomplete="new-password"
		placeholder="Password"
		value={$form.password}
		constraints={$constraints.password}
		errors={$errors.password}
		on:change={()=>{
			passwordTouched=true;
		}}
	/>
	<PasswordInput
		label="Confirm Password"
		name="passwordConfirm"
		placeholder="Password again"
		value={$form.passwordConfirm}
		errors={$errors.passwordConfirm}
		constraints={$constraints.passwordConfirm}
	/>

	{#if passwordTouched}
		<label for="password-strength">Password strength: {strengthDescription}</label>
		<meter id="password-strength" value={score} low="1.9" high="2.9" optimum="4" max="4" />
		{#if warning}
			<span class="warning"> {warning}</span>
			<ul>
				{#each suggestions as suggestion}
					<li class="alert">{suggestion}</li>
				{/each}
			</ul>
		{/if}
	{/if}
	<p>
		<button type="submit" class="btn">Submit</button>
	</p>
</form>

{#if data.unitNum}
	<p>Already have an account <a class="a" href="/login?unitNum={data.unitNum}">Login</a></p>
{:else}
<p>Already have an account? <a class="a" href="/login">Login</a></p>
{/if}