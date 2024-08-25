<script lang="ts">
	import type { PageData } from './$types';
	import { LightSwitch, initializeStores, Drawer, Toast } from '@skeletonlabs/skeleton';
	import "../app.css";
	import Toasts from '$lib/Toasts/Toasts.svelte';
	initializeStores();
</script>

<nav>
	<li>
		<a href="/login">Login</a>
	</li>
	<li>
		<a href="/logout">Logout</a>
	</li>
	<li>
		<a href="/register/addressForm" class="a">Address Form</a>
	</li>
	<a href="/register">Register</a>
	<a href="/units">units</a>
	<a href="/units/available">Available units</a>
	<a href="/units/newLease">New Lease</a>
	<a href="/employees">employees</a>
	<a href="/users">users</a>

</nav>
<LightSwitch />
<Drawer />
<Toasts />
<slot></slot>
