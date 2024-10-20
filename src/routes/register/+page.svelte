<script lang="ts">
	// @ts-ignore: it works
	import { PUBLIC_COMPANY_NAME } from '$env/static/public'
	import { zxcvbn, zxcvbnOptions, type Score } from "@zxcvbn-ts/core";
	import * as zxcvbnCommonPackage from "@zxcvbn-ts/language-common";
	import * as zxcvbnEnPackage from "@zxcvbn-ts/language-en";
	import { superForm } from "sveltekit-superforms";
	
	import type { PageData } from './$types';
	import EmailForm from '$lib/forms/EmailForm.svelte';
	import PasswordForm from '$lib/forms/PasswordForm.svelte';
	
	export let data:PageData
</script>

<svelte:head>
	<title>{PUBLIC_COMPANY_NAME} | Register</title>
</svelte:head>


<EmailForm data={data.emailForm} />
<PasswordForm data={data.passwordForm} />
{#if data.unitNum}
	<p>Already have an account <a class="a" href="/login?unitNum={data.unitNum}">Login</a></p>
{:else}
<p>Already have an account? <a class="a" href="/login">Login</a></p>
{/if}