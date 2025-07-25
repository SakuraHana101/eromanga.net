<script lang="ts">
import { redirect } from '@sveltejs/kit';
import type { LayoutLoad } from './$types';

export const load: LayoutLoad = async ({ data, fetch }) => {
  // ตรวจสอบ session ฝั่ง client ทุก 10 วินาที (ผ่านฟังก์ชันใน layout.svelte)
  return {
    user: data.user
  };
};


  import { Book, FileText, Tag, Clock, Landmark } from 'lucide-svelte';
</script>

<div class="min-h-screen bg-gray-50 text-gray-800 flex">
  <!-- Sidebar -->
  <aside class="w-64 bg-white border-r p-6 hidden md:block">
    <h1 class="text-2xl font-bold text-primary mb-8">📊 MetaDash</h1>
    <nav class="space-y-4">
      <a href="/admin/manga" class="flex items-center gap-2 text-gray-700 hover:text-blue-600 transition">
        <Book class="w-5 h-5" /> มังงะ
      </a>
      <a href="/admin/episodes" class="flex items-center gap-2 text-gray-700 hover:text-blue-600 transition">
        <FileText class="w-5 h-5" /> ตอน
      </a>
      <a href="/admin/categories" class="flex items-center gap-2 text-gray-700 hover:text-blue-600 transition">
        <Tag class="w-5 h-5" /> หมวดหมู่ / แท็ก
      </a>
      <a href="/admin/schedule" class="flex items-center gap-2 text-gray-700 hover:text-blue-600 transition">
        <Clock class="w-5 h-5" /> ตั้งเวลาโพสต์
      </a>
      <a href="/admin/ads" class="flex items-center gap-2 text-gray-700 hover:text-blue-600 transition">
        <Landmark class="w-5 h-5" /> โฆษณา
      </a>
    </nav>
  </aside>

  <!-- Main Content -->
  <main class="flex-1 p-6">
    <slot />
  </main>
</div>
