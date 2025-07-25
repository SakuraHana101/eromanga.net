<!-- src/routes/admin/login/+page.svelte -->
<script lang="ts">
  export let form;
</script>
<svelte:head>
  <link rel="stylesheet" href="/admin/login/style.css" />
</svelte:head>
<div class="login-bg">

<section>
  <span></span>
  <div class="signin">
    <div class="content">
      <h2>Login</h2>
      <div class="form">
        <form method="POST">
          <div class="inputBox">
            <input name="username" type="text" required />
            <i>Username</i>
          </div>
          <div class="inputBox">
            <input name="password" type="password" required />
            <i>Password</i>
          </div>
          {#if form?.error}
            <p class="text-red-500">{form.error}</p>
          {/if}
          <div class="inputBox">
            <input type="submit" value="Login" />
          </div>
        </form>
      </div>
    </div>
  </div>
</section>
</div>