<script lang="ts">
  import { goto } from '$app/navigation';
  export let data: {
    mangaId: string;
    manga: {
      title: string;
      coverUrl: string;
      pageUrls: string[];
    };
  };

  let { manga } = data;

  // ตัวแปรสำหรับแก้ไขข้อมูล
  let title = manga.title;
  let coverUrl = manga.coverUrl;
  let pageUrls = manga.pageUrls;

  // รวม URLs ของหน้ามังงะเป็นข้อความ (คั่นด้วยคอมม่า)
  let pageUrlsText = pageUrls.join(', ');

  async function handleSave() {
    if (!title.trim() || !coverUrl.trim() || pageUrlsText.trim() === '') {
      alert('กรุณากรอกข้อมูลให้ครบ');
      return;
    }

    const updatedPageUrls = pageUrlsText
      .split(',')
      .map((s) => s.trim())
      .filter(Boolean);

    try {
      const res = await fetch('/api/admin/save-manga', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          mangaId: data.mangaId,
          title,
          coverUrl,
          pageUrls: updatedPageUrls
        })
      });

      const json = await res.json();

      if (!res.ok) {
        alert('❌ เกิดข้อผิดพลาดระหว่างบันทึก: ' + (json.error || ''));
        return;
      }

      alert('✅ บันทึกสำเร็จ');
      goto('/admin/manga');
    } catch (error) {
      console.error('❌ Save manga error:', error);
      alert('❌ เกิดข้อผิดพลาดขณะบันทึก');
    }
  }
</script>

<style>
  .container {
    max-width: 900px;
    margin: auto;
    padding: 1rem 2rem;
  }
  label {
    font-weight: 600;
    display: block;
    margin-bottom: 0.25rem;
  }
  input,
  textarea {
    width: 100%;
    padding: 0.5rem;
    margin-bottom: 1rem;
    font-size: 1rem;
    border: 1px solid #ccc;
    border-radius: 6px;
    box-sizing: border-box;
  }
  button {
    background-color: #10b981;
    color: white;
    padding: 0.75rem 1.5rem;
    border: none;
    border-radius: 8px;
    font-size: 1.1rem;
    cursor: pointer;
  }
  button:hover {
    background-color: #059669;
  }
  .cover-preview {
    width: 100%;
    max-width: 400px;
    margin-bottom: 1rem;
    border-radius: 6px;
    object-fit: contain;
    border: 1px solid #ccc;
  }
  .page-previews {
    display: flex;
    flex-wrap: wrap;
    gap: 1rem;
    margin-top: 0.5rem;
  }
  .page-previews img {
    width: 120px;
    height: auto;
    border-radius: 6px;
    border: 1px solid #ccc;
    object-fit: cover;
  }
  .url-info {
    margin-bottom: 1rem;
    background: #f9f9f9;
    border: 1px solid #ddd;
    padding: 0.75rem 1rem;
    border-radius: 6px;
    font-size: 0.9rem;
    word-break: break-all;
    color: #444;
  }
  .url-label {
    font-weight: 700;
    margin-bottom: 0.25rem;
    display: block;
  }
  .url-empty {
    color: #c00;
    font-style: italic;
  }
</style>

<div class="container">
  <h1>✏️ แก้ไขมังงะ: {title}</h1>

  <div class="url-info">
    <span class="url-label">URL ภาพปก:</span>
    {#if coverUrl && coverUrl.trim() !== ''}
      <a href={coverUrl} target="_blank" rel="noopener noreferrer">{coverUrl}</a>
    {:else}
      <span class="url-empty">ยังไม่มี URL ภาพปก</span>
    {/if}
  </div>

  <div class="url-info">
    <span class="url-label">URLs ของหน้ามังงะ:</span>
    {#if pageUrls.length > 0}
      <ul>
        {#each pageUrls as url}
          <li><a href={url} target="_blank" rel="noopener noreferrer">{url}</a></li>
        {/each}
      </ul>
    {:else}
      <span class="url-empty">ยังไม่มี URLs ของหน้ามังงะ</span>
    {/if}
  </div>

  <form on:submit|preventDefault={handleSave}>
    <div class="form-group">
      <label for="title">ชื่อมังงะ</label>
      <input id="title" type="text" bind:value={title} placeholder="ชื่อมังงะ" />
    </div>

    <div class="form-group">
      <label for="coverUrl">URL ภาพปก</label>
      <input
        id="coverUrl"
        type="text"
        bind:value={coverUrl}
        placeholder="URL ภาพปก"
      />
      {#if coverUrl}
        <img src={coverUrl} alt="ภาพปกมังงะ" class="cover-preview" />
      {/if}
    </div>

    <div class="form-group">
      <label for="pageUrlsText">URLs ของหน้ามังงะ (คั่นด้วยเครื่องหมายคอมม่า ,)</label>
      <textarea
        id="pageUrlsText"
        rows="6"
        bind:value={pageUrlsText}
        placeholder="https://example.com/page1.jpg, https://example.com/page2.jpg, ..."
      ></textarea>

      {#if pageUrlsText.trim().length > 0}
        <div class="page-previews">
          {#each pageUrlsText.split(',').map((s) => s.trim()).filter(Boolean) as url, i}
            <img src={url} alt={`หน้า ${i + 1}`} title={`หน้า ${i + 1}`} />
          {/each}
        </div>
      {/if}
    </div>

    <button type="submit">💾 บันทึกข้อมูล</button>
  </form>
</div>
