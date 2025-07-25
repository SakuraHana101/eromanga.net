<script lang="ts">
  import { Menu, LogOut, X } from 'lucide-svelte';
  import { writable } from 'svelte/store';

  export let menus = [];

  const sidebarOpen = writable(true);
  function toggleSidebar() {
    sidebarOpen.update(v => !v);
  }

  $: isClosed = $sidebarOpen === false;

  let showLogoutConfirm = false;

  function openLogoutConfirm() {
    showLogoutConfirm = true;
  }
  function closeLogoutConfirm() {
    showLogoutConfirm = false;
  }

  async function handleLogout() {
    try {
      const res = await fetch('/admin/logout', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (res.ok) {
        const bc = new BroadcastChannel('auth');
        bc.postMessage('logout');
        bc.close();
        window.location.href = '/admin/login';
      } else {
        alert('Logout ล้มเหลว กรุณาลองใหม่อีกครั้ง');
      }
    } catch (error) {
      alert('เกิดข้อผิดพลาดขณะออกจากระบบ');
      console.error(error);
    }
  }
</script>

<style>
  /* Sidebar เดิมปรับให้เหมือนเดิม */
  .sidebar {
    background-color: #000000;
    width: 240px;
    transition: width 0.3s ease;
    overflow: hidden;
    display: flex;
    flex-direction: column;
    justify-content: space-between;

    position: fixed; /* ติดขอบหน้าจอ */
    top: 0;
    left: 0;
    height: 100vh; /* เต็มความสูงหน้าจอ */
    z-index: 50;
  }

  .sidebar.closed {
    width: 64px;
  }

  nav a {
    display: flex;
    align-items: center;
    gap: 12px;
    padding: 12px 16px;
    color: #F0FFFF;
    font-weight: 600;
    border-radius: 0.75rem;
    margin: 6px 8px;
    transition: background-color 0.2s ease, color 0.3s ease;
    text-decoration: none;
  }

  nav a:hover {
    background-color: #B22222;
    color: white;
  }

  .label {
    white-space: nowrap;
  }

  .sidebar.closed .label {
    display: none;
  }

  .toggle-btn {
    background: none;
    border: none;
    cursor: pointer;
    padding: 12px;
    width: 100%;
    text-align: right;
    color: #374151;
  }

  .toggle-btn:hover {
    color: #2563eb;
  }

  .logout-button {
    width: 100%;
    background-color: #fef2f2;
    color: #b91c1c;
    font-weight: bold;
    padding: 10px 16px;
    border-radius: 0.75rem;
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 8px;
    border: none;
    cursor: pointer;
    transition: background-color 0.2s ease;
  }

  .logout-button:hover {
    background-color: #f87171;
  }

  .logout-button:active {
    background-color: #dc2626;
  }

  .sidebar.closed .logout-button .label {
    display: none;
  }

  /* Modal overlay ด้านหลัง */
  .modal-overlay {
    position: fixed;
    inset: 0;
    background-color: rgba(0, 0, 0, 0.5);
    backdrop-filter: blur(3px);
    display: flex;
    justify-content: center;
    align-items: center;
    z-index: 100;
    opacity: 0;
    animation: fadeIn 0.3s forwards;
  }

  /* กล่อง modal */
  .modal-box {
    background: #1f2937; /* สีเทาเข้ม */
    padding: 2rem;
    border-radius: 1rem;
    width: 320px;
    color: #f9fafb;
    box-shadow: 0 10px 30px rgba(0, 0, 0, 0.4);
    position: relative;
    animation: slideIn 0.3s forwards;
  }

  /* ปุ่ม close modal */
  .modal-close-btn {
    position: absolute;
    top: 0.5rem;
    right: 0.5rem;
    background: transparent;
    border: none;
    cursor: pointer;
    color: #d1d5db;
  }
  .modal-close-btn:hover {
    color: #f87171;
  }

  /* ปุ่มยืนยัน */
  .btn-confirm {
    background-color: #ef4444;
    color: white;
    font-weight: bold;
    padding: 0.5rem 1rem;
    border-radius: 0.5rem;
    border: none;
    cursor: pointer;
    transition: background-color 0.2s ease;
    margin-right: 1rem;
  }
  .btn-confirm:hover {
    background-color: #b91c1c;
  }

  /* ปุ่มยกเลิก */
  .btn-cancel {
    background-color: #6b7280;
    color: white;
    font-weight: bold;
    padding: 0.5rem 1rem;
    border-radius: 0.5rem;
    border: none;
    cursor: pointer;
    transition: background-color 0.2s ease;
  }
  .btn-cancel:hover {
    background-color: #4b5563;
  }

  /* Animation */
  @keyframes fadeIn {
    to {
      opacity: 1;
    }
  }
  @keyframes slideIn {
    from {
      transform: translateY(-20px);
      opacity: 0;
    }
    to {
      transform: translateY(0);
      opacity: 1;
    }
  }
</style>

<aside class="sidebar" class:closed={isClosed}>
  <div>
    <button class="toggle-btn" on:click={toggleSidebar} aria-label="Toggle sidebar">
      <Menu class="w-6 h-6" />
    </button>
    <nav>
      {#each menus as { label, icon: Icon, link }}
        <a href={link} aria-label={label} title={label}>
          <Icon class="w-6 h-6 flex-shrink-0" />
          <span class="label">{label}</span>
        </a>
      {/each}
    </nav>
  </div>

  <button class="logout-button" on:click={openLogoutConfirm} aria-label="ออกจากระบบ">
    <LogOut class="w-5 h-5" />
    <span class="label">ออกจากระบบ</span>
  </button>
</aside>

{#if showLogoutConfirm}
  <div
    class="modal-overlay"
    role="dialog"
    aria-modal="true"
    aria-labelledby="logout-dialog-title"
  >
    <div class="modal-box">
      <button
        class="modal-close-btn"
        on:click={closeLogoutConfirm}
        aria-label="Close modal"
      >
        <X class="w-5 h-5" />
      </button>
      <h2
        id="logout-dialog-title"
        style="margin-bottom: 1rem; font-size: 1.25rem; font-weight: bold;"
      >
        ยืนยันการออกจากระบบ
      </h2>
      <p style="margin-bottom: 1.5rem;">
        คุณแน่ใจหรือว่าต้องการออกจากระบบ?
      </p>
      <div style="text-align: right;">
        <button class="btn-cancel" on:click={closeLogoutConfirm}>
          ยกเลิก
        </button>
        <button
          class="btn-confirm"
          on:click={() => {
            closeLogoutConfirm();
            handleLogout();
          }}
        >
          ออกจากระบบ
        </button>
      </div>
    </div>
  </div>
{/if}
