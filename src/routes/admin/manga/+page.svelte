<script lang="ts">
  import { onMount, onDestroy } from 'svelte';
  import { goto } from '$app/navigation';

  let title = '';
  let coverUrl: string | null = null;
  let pageUrls: string[] = [];

  let uploading = false;
  let uploadedSuccessfully = false;

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
      const { title: t, cover, pages } = JSON.parse(previewData);
      if (!t || !cover || !pages || pages.length === 0) {
        throw new Error('ข้อมูลไม่ครบ');
      }
      title = t;
      coverUrl = cover;
      pageUrls = pages;
    } catch (e) {
      console.error('❌ Error loading preview:', e);
      alert('❌ ข้อมูลพรีวิวผิดพลาด กรุณาอัปโหลดใหม่');
      goto('/admin/manga/create');
    }
  });

  async function handleSave() {
    if (!title || !coverUrl || pageUrls.length === 0) {
      alert('กรุณาใส่ข้อมูลให้ครบ');
      return;
    }

    uploading = true;
    uploadedSuccessfully = false;

    try {
      const formData = new FormData();
      formData.append('title', title);

      // แปลง base64 cover เป็น Blob แล้วเพิ่มใน FormData
      const coverRes = await fetch(coverUrl!);
      const coverBlob = await coverRes.blob();
      formData.append('cover', new File([coverBlob], 'cover.jpg', { type: coverBlob.type }));

      // แปลง base64 แต่ละหน้าเป็น Blob แล้วเพิ่มใน FormData
      for (let i = 0; i < pageUrls.length; i++) {
        const pageRes = await fetch(pageUrls[i]);
        const pageBlob = await pageRes.blob();
        formData.append('pages', new File([pageBlob], `page-${i + 1}.jpg`, { type: pageBlob.type }));
      }

      // เรียก API อัปโหลดไฟล์จริง
      const uploadRes = await fetch('/api/upload-r2', {
        method: 'POST',
        body: formData
      });

      const json = await uploadRes.json();

      if (!uploadRes.ok || !json.success) {
        console.error('❌ Upload error response:', json);
        alert('❌ เกิดข้อผิดพลาดระหว่างอัปโหลด: ' + (json.error ?? 'ไม่ทราบสาเหตุ'));
        uploading = false;
        return;
      }

      uploadedSuccessfully = true;

      alert('✅ อัปโหลดสำเร็จ! กำลังนำไปยังหน้าจัดการ');
      localStorage.removeItem('mangaPreviewData');
      goto(`/admin/manga/edit/${json.mangaId}`);

    } catch (err) {
      console.error('❌ Upload failed:', err);
      if (!uploadedSuccessfully) {
        alert('❌ เกิดข้อผิดพลาดระหว่างอัปโหลด กรุณาลองใหม่');
      }
    } finally {
      uploading = false;
    }
  }
</script>

<svelte:head>
  <title>Preview: {title}</title>
</svelte:head>

<div class="container">
  <h1>📖 พรีวิวมังงะ: {title}</h1>

  <button class="save-btn" on:click={handleSave} disabled={uploading}>
    {uploading ? '⏳ กำลังอัปโหลด...' : '💾 อัปโหลดและบันทึก'}
  </button>

  {#if coverUrl}
    <div class="preview-section">
      <h2>ภาพปก</h2>
      <img class="preview-img" src={coverUrl} alt="cover" />
    </div>
  {/if}

  {#if pageUrls.length > 0}
    <div class="preview-section">
      <h2>หน้ามังงะทั้งหมด</h2>
      <div class="grid">
        {#each pageUrls as url, i}
          <div class="img-wrapper">
            <img class="preview-img" src={url} alt={`page ${i + 1}`} />
            <p class="caption">Page {i + 1}</p>
          </div>
        {/each}
      </div>
    </div>
  {/if}
</div>

<style>
  .container {
    padding: 2rem;
    max-width: 900px;
    margin: auto;
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
  }

  .save-btn[disabled] {
    background-color: #9ca3af;
    cursor: not-allowed;
  }

  .preview-section {
    margin-bottom: 2rem;
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
