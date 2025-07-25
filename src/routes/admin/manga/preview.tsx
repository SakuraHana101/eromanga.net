// src/routes/admin/manga/preview/+page.tsx
'use client';

import { useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Button } from '@/components/ui/button';

type MangaImageData = {
  title: string;
  coverUrl: string;
  pageUrls: string[];
};

export default function PreviewPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const mangaId = searchParams.get('mangaId') ?? '';

  const [loading, setLoading] = useState(true);
  const [imageData, setImageData] = useState<MangaImageData | null>(null);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!mangaId) return;

    const fetchImages = async () => {
      try {
        const res = await fetch(`/api/admin/get-manga/${mangaId}`);
        if (!res.ok) throw new Error('ไม่สามารถโหลดข้อมูลภาพได้');

        const data = await res.json();
        setImageData(data);
      } catch (err) {
        setError((err as Error).message);
      } finally {
        setLoading(false);
      }
    };

    fetchImages();
  }, [mangaId]);

  const handleSubmit = async () => {
    try {
      // POST ไปยัง endpoint ที่คุณใช้บันทึก
      const res = await fetch('/api/upload-bunny', {
        method: 'POST',
        body: JSON.stringify({ mangaId }),
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!res.ok) {
        throw new Error('อัปโหลดไม่สำเร็จ');
      }

      // เมื่อสำเร็จ → redirect ไปหน้าเสร็จสิ้น
      router.push(`/admin/manga/finish/${mangaId}`);
    } catch (err) {
      alert((err as Error).message);
    }
  };

  return (
    <div className="max-w-3xl mx-auto py-10">
      <h1 className="text-2xl font-bold mb-6">พรีวิวมังงะ: {mangaId}</h1>

      {loading && <p>กำลังโหลดภาพ...</p>}
      {error && <p className="text-red-500">{error}</p>}

      {imageData && (
        <div className="space-y-4">
          {imageData.coverUrl && (
            <img
              src={imageData.coverUrl}
              alt="cover"
              className="w-full rounded-xl shadow"
            />
          )}

          {imageData.pageUrls.map((url, i) => (
            <img
              key={i}
              src={url}
              alt={`page ${i + 1}`}
              className="w-full rounded shadow"
              loading="lazy"
            />
          ))}
        </div>
      )}

      <div className="mt-10 flex justify-end">
        <Button onClick={handleSubmit} disabled={loading || !imageData}>
          ✅ ยืนยัน & อัปโหลดเสร็จ
        </Button>
      </div>
    </div>
  );
}
