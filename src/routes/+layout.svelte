<script lang="ts">
	import type { PageData } from './$types';
	import { LightSwitch, initializeStores, Drawer, Toast, Modal, type ModalComponent } from '@skeletonlabs/skeleton';
	// import EmploymentConfirmModal from '$lib/userComponents/EmploymentConfirmModal.svelte';
	// const modalRegistry:Record<string, ModalComponent> = {
	// 	employmentConfirm: { ref: EmploymentConfirmModal },
	// }
	import "../app.css";
	import { Hamburger } from 'svelte-hamburgers'
	let open:boolean | undefined;
	initializeStores();
	export let data:PageData;
</script>

<Hamburger bind:open />
{#if open}

<nav>
	<ul class='list'>
		{#if !data.user}
		<li><a href="/login">Login</a></li>
		{:else}
		<li><form method="post" action="/logout" ><button>Sign Out</button></form></li>
		{/if}
		<li><a href="/register" class="a">Register</a></li>
		<li><a href="/register/addressForm" class="a">Address Form</a></li>
		<li><a href="/units">units</a></li>
		<li><a href="/units/available">Available units</a></li>
		<li><a href="/units/newLease">New Lease</a></li>
		<li><a href="/users">Users</a></li>
		<li><a href="/customers">Customers</a></li>
		<li><a href="/invoice/newInvoice">New Invoice</a></li>
		<li><a href="/paymentRecord/newPaymentRecord">New Payment Record</a></li>
	</ul>
</nav>
{/if}
<LightSwitch />
<Drawer />
<Modal />
<Toast />
<slot></slot>
