<script lang="ts">
    import { page } from '$app/stores';
</script>

<h1 class="h2">{$page.status}: </h1>
<p class="h3">{$page.error?.message}</p>