<script lang="ts">
   import type { InputConstraint } from 'sveltekit-superforms';
 
   interface Props {
      value?: string | undefined;
      label?: string | undefined;
      name?: string | undefined;
      placeholder?: string | undefined;
      autocomplete?: string;
      errors?: string[] | undefined;
      constraints?: InputConstraint | undefined;
      [key: string]: any
   }

   let {
      value = $bindable(undefined),
      label = undefined,
      name = undefined,
      placeholder = undefined,
      autocomplete = "current-password",
      errors = undefined,
      constraints = undefined,
      ...rest
   }: Props = $props();
 </script>
 
 <label>
   {#if label}<span>{label}</span><br />{/if}
   <input
      type="password"
      name={name}
      class="input"
      placeholder={placeholder ? placeholder : "password"}
      bind:value
      aria-invalid={errors ? 'true' : undefined}
      autocomplete={autocomplete ? autocomplete : "current-password"}
      {...constraints}
      {...rest} 
      />
 </label>
 {#if errors}<span class="invalid">{errors}</span>{/if}