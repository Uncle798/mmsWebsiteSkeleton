<script lang="ts">
   // @ts-ignore: it works
   import { PUBLIC_COMPANY_NAME, PUBLIC_STRIPE_TEST } from '$env/static/public';   
   // @ts-ignore: it works
   import type { PageData } from './$types';
   import { Elements, PaymentElement, LinkAuthenticationElement, Address, Card } from 'svelte-stripe';
   import { onMount } from 'svelte';
	import { loadStripe, type StripeElements, type Stripe } from '@stripe/stripe-js';
	import { enhance } from '$app/forms';
   import { goto } from '$app/navigation';
	export let data:PageData;
   let stripe:Stripe|null;
   let clientSecret:string;
   let elements: StripeElements;
   let error = null;
   let processing = false;
   let mounted = false;
   onMount(async () =>{
      stripe  = await loadStripe(PUBLIC_STRIPE_TEST);
      clientSecret = await createPaymentIntent();
      mounted=true;
   })
   async function createPaymentIntent() {
      const response = await fetch('/stripe/paymentIntent?invoiceId='+data.invoice?.invoiceId, {
         method: 'POST',
         headers: {
            'content-type': 'applications/json'
         },
         body:JSON.stringify({price:data.invoice?.price}),
      });
      const clientSecret = await response.json();
      return clientSecret;
   }
   async function submit() {
      if(processing) return;
      processing = true;
      const result = await stripe.confirmPayment({
         elements,
         redirect: 'if_required',
      });
      if(result.error){
         error = result.error;
         processing = false;
      } else {
         goto('/units/newLease/leaseSent?leaseId=' + data.invoice?.leaseId);
      }
   }
</script>

<svelte:head>
	<title>{PUBLIC_COMPANY_NAME} | Please pay your deposit</title>
</svelte:head>
{#if !mounted}
   loading...
{:else}
   <p>Please pay a deposit of ${data.invoice?.invoiceAmount}</p>
   <Elements {stripe} clientSecret={clientSecret} bind:elements>
      <form on:submit|preventDefault={submit} >
         <LinkAuthenticationElement />
         <PaymentElement />
         <Address mode='billing' />
         <button class="btn" disabled={processing}>
            {#if processing}
            Processing...
            {:else}
            Pay
            {/if}
         </button>
      </form>
   </Elements>
   
{/if}

