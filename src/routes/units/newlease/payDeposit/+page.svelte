<script lang="ts">
   // @ts-ignore: it works
   import { PUBLIC_COMPANY_NAME, PUBLIC_STRIPE_TEST } from '$env/static/public';   
   // @ts-ignore: it works
   import type { PageData } from './$types';
   import { Elements, PaymentElement } from 'svelte-stripe';
   import { onMount } from 'svelte';
	import { loadStripe } from '@stripe/stripe-js';
	import { enhance } from '$app/forms';
	import { redirect } from '@sveltejs/kit';
	export let data:PageData;
   let stripe = null;
   let clientSecret:string | undefined  = undefined;
   let elements;
   let error = null;
   let processing = false;
   onMount(async () =>{
      stripe  = await loadStripe(PUBLIC_STRIPE_TEST);
      clientSecret = await createPaymentIntent();
   })
   async function createPaymentIntent() {
      const response = await fetch('/stripe/paymentIntent?invoiceId='+data.invoice?.invoiceId, {
         method: 'POST',
         headers: {
            'content-type': 'applications/json'
         },
         body:JSON.stringify({price:data.invoice?.price}),
      });
      console.log('payDeposit '+response);
      const { clientSecret } = await response.json();
      return clientSecret;
   }
   async function submit() {
      if(processing) return;
      processing = true;
      const result = await stripe.confirmPayment({
         elements,
         redirect: 'if_required',
      });
      console.log({result});
      if(result.error){
         error = result.error;
         processing = false;
      } else {
         redirect(302,'/units/newLease/leaseSent?leaseId=' + data.invoice?.leaseId);
      }
   }
</script>

<svelte:head>
	<title>{PUBLIC_COMPANY_NAME} | Please pay your deposit</title>
</svelte:head>
{#if clientSecret}
<Elements {stripe} {clientSecret} bind:elements>
   <form on:submit|preventDefault={submit} use:enhance>
      <PaymentElement />
      <button class="btn" disabled={processing}>
         {#if processing}
            Processing...
            {:else}
            Pay
         {/if}
      </button>
   </form>
</Elements>
{:else}
   loading....
{/if}