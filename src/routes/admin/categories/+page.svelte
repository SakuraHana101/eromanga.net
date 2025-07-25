<script lang="ts">
  export let data;
</script>

<form method="POST" use:enhance>
  <input name="name" placeholder="New category" class="border px-2 py-1" />
  <button formaction="?/create" class="bg-blue-500 text-white px-3 py-1 rounded ml-2">
    Add
  </button>
</form>

<ul class="mt-4">
  {#each data.categories as cat}
    <li class="flex justify-between items-center border-b py-1">
      <span>{cat.name}</span>
      <form method="POST" action="/admin/actions/delete-category">
        <input type="hidden" name="id" value={cat.id} />
        <button class="text-red-600 text-sm">Delete</button>
      </form>
    </li>
  {/each}
</ul>
