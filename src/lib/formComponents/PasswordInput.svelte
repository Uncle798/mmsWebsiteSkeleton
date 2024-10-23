<script lang="ts">
   import type { InputConstraint } from 'sveltekit-superforms';
 
   export let value: string | undefined = undefined;
   export let label: string | undefined = undefined;
   export let name: string | undefined = undefined;
   export let placeholder: string | undefined = undefined;
   export let autocomplete:string ="current-password";
   export let errors: string[] | undefined = undefined;
   export let constraints: InputConstraint | undefined = undefined;
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
      {...$$restProps} 
      />
 </label>
 {#if errors}<span class="invalid">{errors}</span>{/if}