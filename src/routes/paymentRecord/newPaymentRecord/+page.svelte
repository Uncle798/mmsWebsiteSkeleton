<script lang="ts">
   import { PUBLIC_COMPANY_NAME } from '$env/static/public'
   import { error } from '@sveltejs/kit';
   import { superForm } from 'sveltekit-superforms'
   import type { PageData } from './$types';
   import { Autocomplete } from '@skeletonlabs/skeleton';
   import type { AutocompleteOption } from '@skeletonlabs/skeleton';
    
   export let data: PageData;
   const {form, errors, constraints, message, enhance} = superForm(data.form);

</script>

<div>
   <form method="post">
      
   </form>
</div>