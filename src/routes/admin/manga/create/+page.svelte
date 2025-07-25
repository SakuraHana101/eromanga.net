<script lang="ts">
  import { onDestroy } from 'svelte';
  import { goto } from '$app/navigation';

  let mangaTitle = '';
  let coverFile: File | null = null;
  let mangaImages: File[] = [];

  $: isReadyToPreview = mangaTitle.trim() !== '' && coverFile && mangaImages.length > 0;

  let coverPreviewUrl: string | null = null;
  let mangaPreviews: string[] = [];

  $: {
    if (coverFile) {
      URL.revokeObjectURL(coverPreviewUrl || '');
      coverPreviewUrl = URL.createObjectURL(coverFile);
    } else {
      coverPreviewUrl = null;
    }
  }

  $: {
    mangaPreviews.forEach(url => URL.revokeObjectURL(url));
    mangaPreviews = mangaImages.map(f => URL.createObjectURL(f));
  }

  onDestroy(() => {
    if (coverPreviewUrl) URL.revokeObjectURL(coverPreviewUrl);
    mangaPreviews.forEach(url => URL.revokeObjectURL(url));
  });

  function handleCoverChange(event: Event) {
    const input = event.target as HTMLInputElement;
    if (input.files?.length) {
      coverFile = input.files[0];
    }
  }

  function handleMangaImagesChange(event: Event) {
    const input = event.target as HTMLInputElement;
    if (input.files?.length) {
      mangaImages = [...mangaImages, ...Array.from(input.files)];
    }
  }

  function removeCover() {
    coverFile = null;
  }

  function removeMangaImage(index: number) {
    mangaImages = mangaImages.filter((_, i) => i !== index);
  }

  async function handlePreview() {
    if (!isReadyToPreview || !coverFile || mangaImages.length === 0) return;

    const readFileAsBase64 = (file: File) =>
      new Promise<string>((resolve) => {
        const reader = new FileReader();
        reader.onload = () => resolve(reader.result as string);
        reader.readAsDataURL(file);
      });

    const coverBase64 = await readFileAsBase64(coverFile);
    const mangaPages = await Promise.all(mangaImages.map(readFileAsBase64));

    const previewData = {
      title: mangaTitle,
      cover: coverBase64,
      pages: mangaPages
    };

    localStorage.setItem('mangaPreviewData', JSON.stringify(previewData));
    await goto('/admin/manga/preview');
  }

  function handleDropCover(event: DragEvent) {
    event.preventDefault();
    if (event.dataTransfer?.files?.length) {
      coverFile = event.dataTransfer.files[0];
    }
  }

  function handleDropImages(event: DragEvent) {
    event.preventDefault();
    if (event.dataTransfer?.files?.length) {
      mangaImages = [...mangaImages, ...Array.from(event.dataTransfer.files)];
    }
  }

  function preventDefault(event: Event) {
    event.preventDefault();
  }

  let dragSrcIndex: number | null = null;

  function handleDragStart(event: DragEvent, index: number) {
    dragSrcIndex = index;
    event.dataTransfer?.setData('text/plain', String(index));
    event.dataTransfer?.setDragImage(new Image(), 0, 0);
  }

  function handleDragOver(event: DragEvent) {
    event.preventDefault();
  }

  function handleDropSort(event: DragEvent, dropIndex: number) {
    event.preventDefault();
    if (dragSrcIndex === null || dragSrcIndex === dropIndex) return;

    const newImages = [...mangaImages];
    const [moved] = newImages.splice(dragSrcIndex, 1);
    newImages.splice(dropIndex, 0, moved);
    mangaImages = newImages;

    dragSrcIndex = null;
  }
</script>

<div class="form-create-manga space-y-6">
  <h1 class="text-xl font-bold text-center">📝 สร้างมังงะใหม่</h1>

  <input
    class="input-title"
    type="text"
    placeholder="ใส่ชื่อมังงะ"
    bind:value={mangaTitle}
  />

  <div
    role="region"
    class="dropzone"
    on:dragover={preventDefault}
    on:drop={handleDropCover}
  >
    <p>ลากไฟล์ภาพปกมาวาง หรือ</p>
    <input type="file" accept="image/*" on:change={handleCoverChange} />
  </div>

  {#if coverPreviewUrl}
    <div class="preview-single">
      <h4>ภาพปกที่เลือก:</h4>
      <div class="preview-img-wrapper">
        <img src={coverPreviewUrl} alt="Cover preview" />
        <button class="btn-remove" on:click={removeCover} title="ลบภาพปก">✖</button>
      </div>
    </div>
  {/if}

  <div
    role="region"
    class="dropzone"
    on:dragover={preventDefault}
    on:drop={handleDropImages}
  >
    <p>ลากภาพมังงะหลายภาพมาวาง หรือ</p>
    <input type="file" accept="image/*" multiple on:change={handleMangaImagesChange} />
  </div>

  {#if mangaPreviews.length > 0}
    <div class="preview-grid" role="list">
      <h4>ภาพมังงะที่เลือก (ลากเพื่อจัดลำดับใหม่):</h4>
      <div class="grid-images">
        {#each mangaPreviews as src, i}
          <div
            role="listitem"
            class="preview-img-wrapper"
            draggable="true"
            on:dragstart={(e) => handleDragStart(e, i)}
            on:dragover={handleDragOver}
            on:drop={(e) => handleDropSort(e, i)}
            title="ลากเพื่อจัดลำดับ"
          >
            <img src={src} alt={`Page ${i + 1}`} />
            <button class="btn-remove" on:click={() => removeMangaImage(i)} title="ลบภาพ">✖</button>
          </div>
        {/each}
      </div>
    </div>
  {/if}

  <button
    class="btn-preview {isReadyToPreview ? 'active' : ''}"
    on:click={handlePreview}
    disabled={!isReadyToPreview}
  >
    Preview
  </button>
</div>

<style>
  .form-create-manga {
    max-width: 700px;
    margin: auto;
    padding: 2rem;
    background: #fff;
    border-radius: 1rem;
    box-shadow: 0 2px 10px rgba(0, 0, 0, 0.05);
  }

  .input-title {
    width: 100%;
    padding: 0.75rem;
    font-size: 1rem;
    border: 1px solid #ccc;
    border-radius: 0.5rem;
  }

  .dropzone {
    border: 2px dashed #ccc;
    border-radius: 0.75rem;
    padding: 1.25rem;
    text-align: center;
    color: #666;
    background: #f9fafb;
    transition: border-color 0.3s;
    margin-bottom: 1rem;
  }
  .dropzone:hover {
    border-color: #ff9800;
    background: #fff7e6;
  }

  .preview-single, .preview-grid {
    margin-bottom: 1rem;
  }

  .grid-images {
    display: grid;
    grid-template-columns: repeat(auto-fill,minmax(120px,1fr));
    gap: 0.75rem;
  }

  .preview-img-wrapper {
    position: relative;
    border-radius: 8px;
    cursor: grab;
  }

  .preview-img-wrapper img {
    width: 100%;
    border-radius: 8px;
    border: 1px solid #ccc;
    object-fit: cover;
    aspect-ratio: 3/4;
  }

  .btn-remove {
    position: absolute;
    top: 6px;
    right: 6px;
    background: rgba(0,0,0,0.6);
    border: none;
    color: white;
    font-weight: bold;
    border-radius: 50%;
    width: 22px;
    height: 22px;
    cursor: pointer;
  }
  .btn-remove:hover {
    background: rgba(255,0,0,0.8);
  }

  .btn-preview {
    width: 100%;
    padding: 0.8rem;
    font-weight: bold;
    border-radius: 0.5rem;
    background: #ccc;
    color: white;
    cursor: not-allowed;
    transition: background 0.3s;
  }

  .btn-preview.active {
    background: #ff9800;
    cursor: pointer;
  }

  .btn-preview.active:hover {
    background: #fb8c00;
  }
</style>
