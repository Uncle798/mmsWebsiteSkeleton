<script lang="ts">
    import { superForm } from 'sveltekit-superforms';
    import type { PageData } from './$types';
	import EmailForm from '$lib/forms/EmailForm.svelte';
    
    interface Props {
        data: PageData;
    }

    let { data }: Props = $props();
    const { form, message, errors, constraints, enhance } = superForm(data.form);
</script>
<EmailForm data={data.form} />