// src/routes/admin/manga/finish/[mangaId]/+page.tsx

export default function FinishPage({ params }: { params: { mangaId: string } }) {
  return (
    <div className="p-10 text-center">
      <h1 className="text-3xl font-bold mb-4">🎉 สำเร็จ!</h1>
      <p>มังงะ <strong>{params.mangaId}</strong> ถูกอัปโหลดและบันทึกเรียบร้อยแล้ว</p>
    </div>
  );
}
