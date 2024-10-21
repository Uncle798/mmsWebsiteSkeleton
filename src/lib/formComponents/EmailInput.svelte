<script lang="ts">
   import type { InputConstraint } from 'sveltekit-superforms';
 
   export let value: string | undefined = undefined;
   export let label: string | undefined = undefined;
   export let placeholder: string | undefined = undefined;
   export let errors: string[] | undefined = undefined;
   export let constraints: InputConstraint | undefined = undefined;
 </script>
 
 <label>
   {#if label}<span>{label}</span><br />{/if}
   <input
      type="email"
      class="input"
      placeholder={placeholder ? placeholder : "email@email.email"}
      bind:value
      aria-invalid={errors ? 'true' : undefined}
      {...constraints}
      {...$$restProps} 
      />
 </label>
 {#if errors}<span class="invalid">{errors}</span>{/if}