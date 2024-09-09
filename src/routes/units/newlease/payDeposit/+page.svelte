<script lang="ts">
   // @ts-ignore: it works
   import { PUBLIC_COMPANY_NAME, PUBLIC_STRIPE_TEST } from '$env/static/public';   
   // @ts-ignore: it works
   import type { PageData } from './$types';
   import { Elements } from 'svelte-stripe';
   import { onMount } from 'svelte';
	import { loadStripe } from '@stripe/stripe-js';
	export let data:PageData;
   let stripe = null;
   onMount(async () =>{
      stripe = await loadStripe(PUBLIC_STRIPE_TEST);
   })
</script>

<svelte:head>
	<title>{PUBLIC_COMPANY_NAME} | Please pay your deposit</title>
</svelte:head>

<Elements {stripe} >
   
</Elements>