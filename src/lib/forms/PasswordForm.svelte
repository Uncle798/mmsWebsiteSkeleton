<script lang="ts">
	// @ts-ignore: it works
	import { zxcvbn, zxcvbnOptions, type Score } from "@zxcvbn-ts/core";
	import * as zxcvbnCommonPackage from "@zxcvbn-ts/language-common";
	import * as zxcvbnEnPackage from "@zxcvbn-ts/language-en";
	import { superForm } from "sveltekit-superforms";
	import { getToastStore } from '@skeletonlabs/skeleton';
	import type { ToastSettings } from '@skeletonlabs/skeleton';
   import type { SuperValidated, Infer } from 'sveltekit-superforms/client';
   import type { PasswordFormSchema } from "$lib/formSchemas/schemas";
	import { getModalStore } from "@skeletonlabs/skeleton";
	import PasswordInput from "$lib/formComponents/PasswordInput.svelte";
	
	export let data: SuperValidated<Infer<PasswordFormSchema>>;
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
   const modalStore = getModalStore();
	const toastStore = getToastStore();
   const { form, errors, constraints, message, enhance } = superForm(data, {
      onUpdate(event){
			if(event.result.type === 'success'){
				const toast:ToastSettings = {
					message: 'Password Successfully Updated',
					timeout: 3000,
					background: 'variant-filled-success'
				}
				toastStore.trigger(toast);
			}
			if($modalStore[0]){
				if(!$message){
					modalStore.close();
				}
			}
      }
   });
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
<form method="POST" action="/register/password" class="modal-form border border-surface-500 p-4 space-y-4 rounded-container-token" use:enhance>
	<PasswordInput
		label="Password"
		value={$form.password}
		errors={$errors.password}
		constraints={$constraints.password}
		autocomplete="new-password"
		on:change={()=>{
			passwordTouched=true;
		}}
	/>
	<PasswordInput
		label="Confirm Password"
		value={$form.passwordConfirm}
		errors={$errors.passwordConfirm}
		constraints={$constraints.passwordConfirm}
		autocomplete="new-password"
		placeholder="Password again"
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
