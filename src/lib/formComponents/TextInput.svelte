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
      type="text"
      name={name}
      class="input"
      placeholder={placeholder ? placeholder : undefined}
      bind:value
      aria-invalid={errors ? 'true' : undefined}
      {...constraints}
      {...rest} 
      />
 </label>
 {#if errors}<span class="invalid">{errors}</span>{/if}