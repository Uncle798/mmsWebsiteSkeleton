<script lang="ts">
	import type { PageData } from './$types';
	import { LightSwitch, initializeStores, Drawer, Toast, Modal } from '@skeletonlabs/skeleton';
	import "../app.css";
	import { Hamburger } from 'svelte-hamburgers'
	let open:boolean | undefined;
	initializeStores();
	export let data:PageData;
</script>

<Hamburger bind:open />
{#if open}

<nav>
	{#if !data.user}
		<li><a href="/login">Login</a></li>
	{:else}
		<li><a href="/logout">Logout</a></li>
	{/if}
	<li><a href="/register" class="a">Register</a></li>
	<li><a href="/register/addressForm" class="a">Address Form</a></li>
	<li><a href="/units">units</a></li>
	<li><a href="/units/available">Available units</a></li>
	<li><a href="/units/newLease">New Lease</a></li>
	<li><a href="/employees">employees</a></li>
	<li><a href="/users">users</a></li>

</nav>
{/if}
<LightSwitch />
<Drawer />
<Modal />
<Toast />
<slot></slot>
