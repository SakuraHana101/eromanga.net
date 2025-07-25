<script lang="ts">
  import { onMount } from 'svelte';
  import { page } from '$app/stores';
  import { goto } from '$app/navigation';

  import { registerPlugin } from 'svelte-filepond';
  import FilePondPluginImagePreview from 'filepond-plugin-image-preview';
  import FilePondPluginFileEncode from 'filepond-plugin-file-encode';
  import FilePondPluginFileValidateType from 'filepond-plugin-file-validate-type';

  import 'filepond/dist/filepond.min.css';
  import 'filepond-plugin-image-preview/dist/filepond-plugin-image-preview.css';

  let FilePond = null;
  let files: any[] = [];
  let title = '';
  let message = '';

  let mangaId: string;

  $: mangaId = $page.params.mangaId;

  onMount(async () => {
    const module = await import('svelte-filepond');
    FilePond = module.default;
  });

  async function handleSubmit(event) {
    event.preventDefault();
    message = '';

    const formData = new FormData();
    formData.append('title', title);
    formData.append('mangaId', mangaId);

    files.forEach((file, index) => {
      if (file.file) {
        formData.append('pages', file.file, `page_${index}.jpg`);
      }
    });

    try {
      const res = await fetch('/api/upload/episode', {
        method: 'POST',
        body: formData
      });

      const result = await res.json();
      if (result.success) {
        message = '✅ เพิ่มตอนสำเร็จ';
        title = '';
        files = [];
        setTimeout(() => goto(`/admin/manga/edit/${mangaId}`), 1500);
      } else {
        message = '❌ เกิดข้อผิดพลาด: ' + result.error;
      }
    } catch (err) {
      message = '⚠️ ระบบมีปัญหา: ' + err.message;
    }
  }
</script>

{#if FilePond}
  <form on:submit={handleSubmit} class="form-create-manga">
    <label for="title">ชื่อตอน:</label>
    <input
      id="title"
      type="text"
      bind:value={title}
      placeholder="ตอนที่ 1"
      required
      class="input-title"
    />

    <label for="pages">อัปโหลดหน้ามังงะ:</label>
    <svelte:component
      this={FilePond}
      files={files}
      onupdatefiles={(e) => (files = e.detail)}
      allowMultiple={true}
      allowReorder={true}
      allowProcess={false}
      name="pages"
      acceptedFileTypes={['image/*']}
      labelIdle='ลากและวางภาพ หรือ <span class="filepond--label-action">เลือกไฟล์</span>'
    />

    <button type="submit" class="btn-submit">เพิ่มตอน</button>
    {#if message}
      <p class="message">{message}</p>
    {/if}
  </form>
{/if}

<style>
  .form-create-manga { max-width: 600px; margin: auto; padding: 1rem; }
  .input-title { width: 100%; padding: 0.6rem; margin-bottom: 1rem; border-radius: 8px; }
  .btn-submit { margin-top: 1rem; padding: 0.7rem 1.5rem; font-weight: bold; background-color: #10b981; color: white; border: none; border-radius: 8px; cursor: pointer; }
  .btn-submit:hover { background-color: #059669; }
  .message { margin-top: 1rem; font-weight: 600; }
</style>
