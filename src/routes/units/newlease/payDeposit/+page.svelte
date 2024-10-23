<script lang="ts">
   import { preventDefault } from 'svelte/legacy';

   // @ts-ignore: it works
   import { PUBLIC_COMPANY_NAME, PUBLIC_STRIPE_TEST } from '$env/static/public';   
   // @ts-ignore: it works
   import type { PageData } from './$types';
   import { Elements, PaymentElement, LinkAuthenticationElement, Address, Card } from 'svelte-stripe';
   import { onMount } from 'svelte';
	import { loadStripe, type StripeElements, type Stripe } from '@stripe/stripe-js';
   import { goto } from '$app/navigation';
   interface Props {
      data: PageData;
   }

   let { data }: Props = $props();
   const { address, invoice, user } = data;
   let stripe:Stripe|null = $state();
   let clientSecret:string = $state();
   let elements: StripeElements = $state();
   let error = null;
   let processing = $state(false);
   let mounted = $state(false);
   onMount(async () =>{
      stripe  = await loadStripe(PUBLIC_STRIPE_TEST);
      clientSecret = await createPaymentIntent();
      mounted=true;
   })
   async function createPaymentIntent() {
      const response = await fetch('/stripe/paymentIntent?invoiceId=' + invoice?.invoiceId, {
         method: 'POST',
         headers: {
            'content-type': 'applications/json'
         },
         body:JSON.stringify({price:data.invoice?.invoiceAmount}),
      });
      const clientSecret = await response.json();
      console.log(clientSecret);

      return clientSecret;
   }
   async function submit() {
      if(processing) return;
      processing = true;
      const result = await stripe!.confirmPayment({
         elements,
         redirect: 'if_required',
      });
      if(result.error){
         error = result.error;
         processing = false;
      } else {
         goto('/units/newLease/leaseSent?invoiceId=' + invoice?.invoiceId);
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
   {#if stripe}
   <Elements {stripe} clientSecret={clientSecret} bind:elements>
      <form onsubmit={preventDefault(submit)} >
         {#if  user}
            <LinkAuthenticationElement defaultValues = {
               {
                  email: user?.email
               }
            }/>
         {/if}
         <PaymentElement />
         <Address mode='billing' 
            display = {{
               name: 'split'
            }}
            defaultValues = {{
               firstName: user?.givenName,
               lastName: user?.familyName,
               address: {
                  line1: address?.address1,
                  line2: address?.address2 || undefined,
                  city: address?.city,
                  state: address?.state, 
                  country: address?.country || 'US',
                  postal_code: address?.zip,
               }
            }}
         />
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
{/if}

