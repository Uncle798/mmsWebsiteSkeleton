<script lang="ts">
	import { zxcvbn, zxcvbnOptions, type Score } from "@zxcvbn-ts/core";
	import * as zxcvbnCommonPackage from "@zxcvbn-ts/language-common";
	import * as zxcvbnEnPackage from "@zxcvbn-ts/language-en";
	export let data
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
	const { form, errors, constraints, message, enhance } = superForm(data.form)
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
	import { superForm } from "sveltekit-superforms";
</script>

<svelte:head>
	<title>{process.env.COMPANY_NAME} | Register</title>
</svelte:head>


{#if $message}
	<h3>{$message}</h3>
{/if}
<form method="POST" use:enhance>
	<label for="email">Email</label>
	<input type="email" 
		name="email"
		class="input"
		placeholder="email@email.email"
		aria-invalid={$errors.email ? 'true' : undefined}
		bind:value={$form.email}
		{...$constraints.email}
	/>
	{#if $errors.email}
		<span class="invalid">{$errors.email}</span>
	{/if}
	
	<label for="password">password</label>
	<input type="password" name="password" 
	id="password"
	class="input"
	autocomplete="new-password"
	placeholder="Password"
	on:change={()=>{
		passwordTouched=true;
	}}
	aria-invalid={$errors.password ? 'true' : undefined}
	bind:value={$form.password}
	{...$constraints.password}

>

{#if $errors.password}
	<span class="input-error">{$errors.password}</span>
{/if}
<label for="passwordConfirm">Confirm your password</label>
<input type="password" name="passwordConfirm" 
	id="password" 
	class="input"
	placeholder="Password again"
	aria-invalid={$errors.passwordConfirm ? 'true' : undefined}
	bind:value={$form.passwordConfirm}
	{...$constraints.passwordConfirm}
>
{#if $errors.passwordConfirm}
	<span class="input-error">{$errors.passwordConfirm}</span>
{/if}
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
	<button type="submit" class="btn">Register</button>
</p>
</form>
<p>Already have an account? <a class="a" href="/login">Login</a></p>