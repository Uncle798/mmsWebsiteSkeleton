<script lang="ts">
	import { superForm } from "sveltekit-superforms";
	export let data
	const { form, errors, constraints, message, enhance } = superForm(data.form)
</script>
{#if $message}
	<h3>{$message}</h3>
{/if}
<form method="POST" use:enhance>
	<label for="email">Email</label>
	<input type="email" 
		name="email" 
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
	aria-invalid={$errors.password ? 'true' : undefined}
	bind:value={$form.password}
	{...$constraints.password}
>
{#if $errors.password}
	<span class="invalid">{$errors.password}</span>
{/if}
<label for="passwordConfirm">Confirm your password</label>
<input type="password" name="passwordConfirm" 
	id="password" 
	aria-invalid={$errors.passwordConfirm ? 'true' : undefined}
	bind:value={$form.passwordConfirm}
	{...$constraints.passwordConfirm}
>
{#if $errors.passwordConfirm}
	<span class="invalid">{$errors.passwordConfirm}</span>
{/if}
	<button type="submit">Register</button>
</form>
<p>Already have an account? <a href="/login">Login</a></p>