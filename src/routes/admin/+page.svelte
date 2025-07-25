<script lang="ts">
  import { onMount } from 'svelte';
  import { goto } from '$app/navigation';
  import { Home, Book, PlusCircle, List, FileText, Tag, Clock, Landmark } from 'lucide-svelte';

  export let data;

  import Card from '$lib/components/ui/card.svelte';
  import CardContent from '$lib/components/ui/card-content.svelte';
  import Sidebar from '$lib/components/Sidebar.svelte';

  import './dashboard.css';

  const menus = [
    { label: 'จัดการมังงะ', icon: Book, link: '/admin/manga' },
    { label: 'เพิ่มมังงะใหม่', icon: PlusCircle, link: '/admin/manga/create' },
    { label: 'จัดการหมวดหมู่', icon: List, link: '/admin/categories' }
  ];

  onMount(() => {
    const bc = new BroadcastChannel('auth');

    bc.onmessage = (event) => {
      if (event.data === 'logout') {
        goto('/admin/login');
      }
    };

    const interval = setInterval(async () => {
      const res = await fetch('/api/check-session');
      if (res.status === 401) {
        goto('/admin/login');
      }
    }, 10000);

    return () => {
      bc.close();
      clearInterval(interval);
    };
  });
</script>

<!-- ✅ เพิ่ม style="display: flex;" -->
<div class="layout" style="display: flex;">
  <Sidebar {menus} />

  <div class="flex-1">
    <header class="topbar">
      <div class="topbar-content">
        <h1 class="topbar-title">EroManga</h1>
      </div>
    </header>

    <main class="content">
      <h1 class="text-3xl font-bold mb-6 flex items-center gap-2">
        <Home class="w-7 h-7 text-blue-600" /> แดชบอร์ดหลังบ้าน
      </h1>

      <!-- สถิติ -->
      <section class="stats-grid mb-8">
        <div class="stat-card">
          <h3>มังงะทั้งหมด</h3>
          <p class="stat-number">{data.mangaCount}</p>
        </div>
        <div class="stat-card">
          <h3>ออนไลน์ขณะนี้</h3>
          <p class="stat-number">{data.onlineUserCount}</p>
        </div>
      </section>

      <div class="dashboard-grid">
        {#each menus as item}
          <a href={item.link} class="dashboard-link" aria-label={item.label}>
            <Card class="card rounded-full">
              <CardContent class="flex items-center gap-5 p-7">
                <svelte:component this={item.icon} class="icon-blue" />
                <div>
                  <h2 class="card-title">{item.label}</h2>
                  <p class="card-subtitle">{item.link}</p>
                </div>
              </CardContent>
            </Card>
          </a>
        {/each}
      </div>
    </main>
  </div>
</div>
