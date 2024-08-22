<script lang="ts">
	import type { PageData } from './$types';
	import { LightSwitch } from '@skeletonlabs/skeleton';
	import Toasts from '$lib/Toasts/Toasts.svelte';
	import "../app.css";
</script>

<nav>
	<a href="/login">Login</a>
	<a href="/register">Register</a>
	<a href="/units">units</a>
	<a href="/units/available">Available units</a>
	<a href="/employees">employees</a>
	<a href="/users">users</a>
</nav>
<LightSwitch />
<Toasts />
<slot></slot>
