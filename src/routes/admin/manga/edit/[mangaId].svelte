<script lang="ts">
  let coverUrl = "";
  let pageUrls: string[] = [];

  // โหลดข้อมูลจาก API
  onMount(async () => {
    const res = await fetch(`/api/admin/get-manga/${mangaId}`);
    const data = await res.json();
    coverUrl = data.coverUrl;
    pageUrls = data.pageUrls;
  });
</script>

<h2>หน้าปก</h2>
<img src={coverUrl} class="w-64 mb-4 rounded-xl shadow" />

<h2>หน้าทั้งหมด</h2>
<div class="grid grid-cols-2 gap-4">
  {#each pageUrls as url}
    <img src={url} class="w-full rounded-xl border" />
  {/each}
</div>
