'use client'

import { useState } from 'react'

export default function UploadMangaCover() {
  const [coverFile, setCoverFile] = useState<File | null>(null)
  const [coverPreview, setCoverPreview] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) {
      setError('❌ กรุณาอัปโหลดภาพปก')
      setCoverFile(null)
      setCoverPreview(null)
      return
    }

    if (!file.type.startsWith('image/')) {
      setError('❌ ไฟล์ไม่ใช่ภาพ')
      return
    }

    setError(null)
    setCoverFile(file)
    setCoverPreview(URL.createObjectURL(file))
  }

  const handlePreview = () => {
    if (!coverFile) {
      setError('❌ กรุณาอัปโหลดภาพปก 1 ภาพเท่านั้น')
      return
    }
    setError(null)
    // ถ้าอยากทำ logic อื่นในอนาคต เช่น AI tag หรือ ตรวจสอบ ก็ทำที่นี่
  }

  const handleUpload = async () => {
    if (!coverFile) {
      setError('❌ กรุณาอัปโหลดภาพปกก่อน')
      return
    }

    const formData = new FormData()
    formData.append('file', coverFile)

    const res = await fetch('/api/upload/cover', {
      method: 'POST',
      body: formData,
    })

    const result = await res.json()
    if (res.ok) {
      alert('✅ อัปโหลดสำเร็จ: ' + result.url)
    } else {
      alert('❌ อัปโหลดไม่สำเร็จ: ' + result.error)
    }
  }

  return (
    <div className="max-w-md mx-auto mt-10 p-4 border rounded shadow">
      <h2 className="text-xl font-bold mb-4">อัปโหลดภาพปกมังงะ</h2>

      <input
        type="file"
        accept="image/*"
        onChange={handleFileChange}
        className="mb-2"
      />

      <button
        onClick={handlePreview}
        className="bg-blue-500 text-white px-4 py-1 rounded mr-2"
      >
        พรีวิว
      </button>

      <button
        onClick={handleUpload}
        className="bg-green-600 text-white px-4 py-1 rounded"
      >
        อัปโหลดจริง
      </button>

      {error && <p className="text-red-600 mt-2">{error}</p>}

      {coverPreview && (
        <div className="mt-4">
          <p className="font-medium">ภาพตัวอย่าง:</p>
          <img
            src={coverPreview}
            alt="Preview"
            className="w-full max-w-xs border mt-2 rounded"
          />
        </div>
      )}
    </div>
  )
}
