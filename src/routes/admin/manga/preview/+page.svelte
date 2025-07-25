<script lang="ts">
  import { onMount, onDestroy } from 'svelte';
  import { goto } from '$app/navigation';

  let title = '';
  let coverUrl: string | null = null;
  let pageUrls: string[] = [];

  let uploading = false;
  let uploadedSuccessfully = false;

  // Cleanup memory leaks from blob URLs
  onDestroy(() => {
    if (coverUrl?.startsWith('blob:')) URL.revokeObjectURL(coverUrl);
    pageUrls.forEach((url) => {
      if (url.startsWith('blob:')) URL.revokeObjectURL(url);
    });
  });

  onMount(() => {
    const previewData = localStorage.getItem('mangaPreviewData');
    if (!previewData) {
      alert('❌ ไม่พบข้อมูลพรีวิว กรุณาอัปโหลดใหม่');
      goto('/admin/manga/create');
      return;
    }

    try {
      const parsed = JSON.parse(previewData);
      if (!parsed?.title || !parsed?.cover || !Array.isArray(parsed.pages) || parsed.pages.length === 0) {
        throw new Error('ข้อมูลพรีวิวไม่ครบ');
      }

      title = parsed.title;
      coverUrl = parsed.cover;
      pageUrls = parsed.pages;
    } catch (err) {
      console.error('❌ Error loading preview:', err);
      alert('❌ ข้อมูลพรีวิวผิดพลาด กรุณาอัปโหลดใหม่');
      goto('/admin/manga/create');
    }
  });

  async function handleSave() {
    if (!title || !coverUrl || pageUrls.length === 0) {
      alert('❌ กรุณาใส่ข้อมูลให้ครบ');
      return;
    }

    uploading = true;
    uploadedSuccessfully = false;

    try {
      const formData = new FormData();
      formData.append('title', title);

      const coverBlob = await (await fetch(coverUrl)).blob();
      formData.append('cover', new File([coverBlob], 'cover.jpg', { type: coverBlob.type }));

      for (let i = 0; i < pageUrls.length; i++) {
        const pageBlob = await (await fetch(pageUrls[i])).blob();
        formData.append('pages', new File([pageBlob], `page-${i + 1}.jpg`, { type: pageBlob.type }));
      }

      const uploadRes = await fetch('/api/upload-bunny', {
        method: 'POST',
        body: formData
      });

      const result = await uploadRes.json();

      if (!uploadRes.ok || !result.success) {
        throw new Error(result.error ?? 'ไม่ทราบสาเหตุ');
      }

      uploadedSuccessfully = true;
      alert('✅ อัปโหลดสำเร็จ! กำลังนำไปยังหน้าจัดการ');
      localStorage.removeItem('mangaPreviewData');
      goto(`/admin/manga/edit/${result.mangaId}`);
    } catch (err) {
      console.error('❌ Upload failed:', err);
      alert('❌ เกิดข้อผิดพลาดระหว่างอัปโหลด: ' + (err instanceof Error ? err.message : 'ไม่ทราบสาเหตุ'));
    } finally {
      uploading = false;
    }
  }
</script>

<svelte:head>
  <title>Preview: {title}</title>
</svelte:head>

<div class="container">
  <h1>📖 พรีวิวมังงะ: <span class="highlight">{title}</span></h1>

  <button class="save-btn" on:click={handleSave} disabled={uploading}>
    {uploading ? '⏳ กำลังอัปโหลด...' : '💾 อัปโหลดและบันทึก'}
  </button>

  {#if coverUrl}
    <div class="preview-section">
      <h2>ภาพปก</h2>
      <img class="preview-img" src={coverUrl} alt="หน้าปกมังงะ" />
    </div>
  {:else}
    <p>ไม่พบภาพปก</p>
  {/if}

  {#if pageUrls.length > 0}
    <div class="preview-section">
      <h2>หน้ามังงะทั้งหมด</h2>
      <div class="grid">
        {#each pageUrls as url, i}
          <div class="img-wrapper">
            <img class="preview-img" src={url} alt={`หน้าที่ ${i + 1}`} />
            <p class="caption">Page {i + 1}</p>
          </div>
        {/each}
      </div>
    </div>
  {:else}
    <p>ไม่พบหน้ามังงะ</p>
  {/if}
</div>

<style>
  .container {
    padding: 2rem;
    max-width: 900px;
    margin: auto;
  }

  h1 {
    font-size: 1.8rem;
    margin-bottom: 1rem;
  }

  .highlight {
    color: #10b981;
  }

  .save-btn {
    background-color: #10b981;
    color: white;
    padding: 0.8rem 1.2rem;
    border-radius: 8px;
    border: none;
    cursor: pointer;
    margin-bottom: 2rem;
    font-size: 1rem;
    transition: background-color 0.3s;
  }

  .save-btn:hover:not([disabled]) {
    background-color: #059669;
  }

  .save-btn[disabled] {
    background-color: #9ca3af;
    cursor: not-allowed;
  }

  .preview-section {
    margin-bottom: 2.5rem;
  }

  .grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(160px, 1fr));
    gap: 1rem;
  }

  .preview-img {
    width: 100%;
    border: 1px solid #ccc;
    border-radius: 8px;
    aspect-ratio: 3 / 4;
    object-fit: cover;
  }

  .caption {
    text-align: center;
    font-size: 0.85rem;
    margin-top: 0.3rem;
    color: #666;
  }
</style>
