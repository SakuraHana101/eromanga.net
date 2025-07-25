// สร้าง array ของ images ที่มี tags และ preview
const newImages = files.map((file, i) => ({
  id: crypto.randomUUID(),
  file,
  preview: URL.createObjectURL(file),
  tags: ['', '', ''] // จำลอง 3 ช่องแท็ก
}));

// สร้าง state images
const [images, setImages] = useState(newImages);

// แสดงภาพพร้อม Drag & Drop
<DragSortableList images={images} setImages={setImages} />

// ใน handleSubmit
async function handleSubmit(e) {
  e.preventDefault();
  const formData = new FormData();

  images.forEach((img, idx) => {
    formData.append('files', img.file);
    formData.append(`tags-${idx}`, JSON.stringify(img.tags));
    formData.append(`sortOrder-${idx}`, idx.toString());
  });

  // ส่ง formData ไป API
}
