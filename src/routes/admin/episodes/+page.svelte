<script lang="ts">
  export let data;

  // ดึง episodes จาก server
  const episodes = data.episodes;
</script>

<h1 class="text-2xl font-bold mb-4">📄 ตอนทั้งหมด</h1>

<table class="w-full table-auto border">
  <thead class="bg-gray-200 text-left">
    <tr>
      <th class="p-2 border">มังงะ</th>
      <th class="p-2 border">ชื่อตอน</th>
      <th class="p-2 border">วันที่</th>
      <th class="p-2 border">ลิงก์</th>
      <th class="p-2 border">จัดการ</th>
    </tr>
  </thead>
  <tbody>
    {#each episodes as ep}
      <tr class="border-t hover:bg-gray-50">
        <td class="p-2 border">{ep.manga?.title}</td>
        <td class="p-2 border">{ep.title}</td>
        <td class="p-2 border">{new Date(ep.createdAt).toLocaleDateString()}</td>
        <td class="p-2 border">
          <a
            href={`/manga/${ep.mangaId}/${ep.episodeId}`}
            target="_blank"
            class="text-blue-600 underline"
            >ไปยังตอน</a
          >
        </td>
        <td class="p-2 border">
          <form method="POST" action="/admin/actions/delete-episode">
            <input type="hidden" name="id" value={ep.id} />
            <button class="text-red-600 text-sm hover:underline">ลบ</button>
          </form>
        </td>
      </tr>
    {/each}
  </tbody>
</table>
