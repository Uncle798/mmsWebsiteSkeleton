<script lang="ts">
    import { superForm } from 'sveltekit-superforms';
    import type { PageData } from './$types';
	import EmailForm from '$lib/forms/EmailForm.svelte';
    
    export let data: PageData;
    const { form, message, errors, constraints, enhance } = superForm(data.form);
</script>
<EmailForm data={data.form} />