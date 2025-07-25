// 📁 /app/admin/manga/add-episode/page.tsx (ตัวอย่างการใช้งาน)
'use client';

import { useState } from 'react';
import PageImagePreview from '@/components/PageImagePreview';

export default function AddEpisodePage() {
  const [images, setImages] = useState<any[]>([]);

  const handleImageUpload = (e: any) => {
    const files = Array.from(e.target.files);
    const newImages = files.map((file) => ({
      file,
      preview: URL.createObjectURL(file),
      tags: ['', '', '']
    }));
    setImages(newImages);
  };

  const handleTagChange = (imageIndex: number, tagIndex: number, value: string) => {
    const updated = [...images];
    updated[imageIndex].tags[tagIndex] = value;
    setImages(updated);
  };

  const handleSubmit = async () => {
    const formData = new FormData();
    images.forEach((img, idx) => {
      formData.append('files', img.file);
      formData.append(`tags-${idx}`, JSON.stringify(img.tags));
    });
    const res = await fetch('/api/upload/episode', {
      method: 'POST',
      body: formData
    });
    const result = await res.json();
    alert('Upload Success');
  };

  return (
    <div className="p-4">
      <input type="file" multiple accept="image/*" onChange={handleImageUpload} />
      <div className="grid grid-cols-3 gap-4 mt-4">
        {images.map((img, i) => (
          <PageImagePreview key={i} image={img} index={i} onChangeTag={handleTagChange} />
        ))}
      </div>
      <button onClick={handleSubmit} className="mt-4 bg-blue-500 text-white px-4 py-2 rounded">
        บันทึกภาพเรื่อง
      </button>
    </div>
  );
}