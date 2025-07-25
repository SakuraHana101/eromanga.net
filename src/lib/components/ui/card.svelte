<script>
  export let className = '';
</script>

<div class={"rounded-xl border bg-white text-gray-900 shadow " + className}>
  <slot />
</div>
