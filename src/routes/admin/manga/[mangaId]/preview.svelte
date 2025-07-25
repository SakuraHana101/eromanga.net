<script lang="ts">
  import { page } from '$app/stores';
  import { onMount } from 'svelte';

  export let data: {
    title: string;
    cover: File;
    images: File[];
  };

  let coverPreview = '';
  let imagePreviews: string[] = [];

  let seoDescriptions: string[] = []; // ช่องข้อความสำหรับ SEO ต่อภาพ

  onMount(() => {
    coverPreview = URL.createObjectURL(data.cover);
    imagePreviews = data.images.map(file => URL.createObjectURL(file));
    seoDescriptions = data.images.map(() => '');
  });
</script>

<div class="preview-page">
  <h1 class="title">📖 Preview มังงะ: {data.title}</h1>

  <div class="layout">
    <div class="left">
      <img class="cover" src={coverPreview} alt="cover" />
      <div class="image-stack">
        {#each imagePreviews as imgSrc, i}
          <div class="image-item">
            <img src={imgSrc} alt={`Page ${i + 1}`} />
          </div>
        {/each}
      </div>
    </div>

    <div class="right">
      <h3 class="seo-header">SEO Metadata</h3>
      {#each seoDescriptions as desc, i}
        <div class="seo-group">
          <label>SEO Text for Page {i + 1}</label>
          <textarea bind:value={seoDescriptions[i]} rows="2" placeholder="ใส่คำอธิบาย SEO สำหรับภาพที่ {i + 1}"></textarea>
        </div>
      {/each}
    </div>
  </div>
</div>

<style>
  .preview-page {
    max-width: 1200px;
    margin: auto;
    padding: 2rem;
    background: #f9fafb;
  }

  .title {
    text-align: center;
    font-size: 1.5rem;
    margin-bottom: 2rem;
    font-weight: bold;
  }

  .layout {
    display: flex;
    flex-direction: row;
    gap: 2rem;
  }

  .left {
    flex: 2;
  }
  .right {
    flex: 1;
  }

  .cover {
    width: 100%;
    max-width: 300px;
    border-radius: 10px;
    border: 2px solid #ddd;
    margin-bottom: 1rem;
  }

  .image-stack {
    display: flex;
    flex-direction: column;
    gap: 1rem;
  }

  .image-item img {
    width: 100%;
    border-radius: 8px;
    border: 1px solid #ccc;
  }

  .seo-header {
    font-size: 1.2rem;
    margin-bottom: 1rem;
  }

  .seo-group {
    margin-bottom: 1rem;
  }

  .seo-group label {
    display: block;
    font-weight: 600;
    margin-bottom: 0.5rem;
  }

  .seo-group textarea {
    width: 100%;
    padding: 0.5rem;
    border-radius: 6px;
    border: 1px solid #ccc;
    resize: vertical;
  }
</style>
