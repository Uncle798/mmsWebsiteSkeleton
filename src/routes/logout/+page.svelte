<script>

   import { PUBLIC_COMPANY_NAME } from '$env/static/public'
   import { enhance } from '$app/forms'
</script>
<form method="post" action="/logout" use:enhance><button>Sign Out</button></form>