<script lang="ts">
   import type { InputConstraint } from 'sveltekit-superforms';
 
   interface Props {
      value?: string | undefined;
      name?: string | undefined;
      label?: string | undefined;
      placeholder?: string | undefined;
      errors?: string[] | undefined;
      constraints?: InputConstraint | undefined;
      [key: string]: any
   }

   let {
      value = $bindable(undefined),
      name = undefined,
      label = undefined,
      placeholder = undefined,
      errors = undefined,
      constraints = undefined,
      ...rest
   }: Props = $props();
 </script>
 
 <label>
   {#if label}<span>{label}</span><br />{/if}
   <input
      type="email"
      class="input"
      name={name}
      placeholder={placeholder ? placeholder : "email@email.email"}
      bind:value
      aria-invalid={errors ? 'true' : undefined}
      autocomplete="email"
      {...constraints}
      {...rest} 
      />
 </label>
 {#if errors}<span class="invalid">{errors}</span>{/if}