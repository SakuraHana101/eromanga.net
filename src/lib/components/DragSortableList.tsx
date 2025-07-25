// 📁 /components/DragSortableList.tsx
'use client';
import {
  DndContext,
  closestCenter,
  PointerSensor,
  useSensor,
  useSensors
} from '@dnd-kit/core';
import {
  arrayMove,
  SortableContext,
  useSortable,
  verticalListSortingStrategy
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import React from 'react';

export function SortableItem({ image, index }: any) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition
  } = useSortable({ id: image.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...attributes}
      {...listeners}
      className="border rounded p-2 bg-white shadow mb-2"
    >
      <div className="text-sm text-gray-500">#{index + 1}</div>
      <img src={image.preview || image.url} className="w-40 mb-2" />
    </div>
  );
}

export default function DragSortableList({ images, setImages }: any) {
  const sensors = useSensors(useSensor(PointerSensor));

  const handleDragEnd = (event: any) => {
    const { active, over } = event;
    if (active.id !== over.id) {
      const oldIndex = images.findIndex((i: any) => i.id === active.id);
      const newIndex = images.findIndex((i: any) => i.id === over.id);
      const reordered = arrayMove(images, oldIndex, newIndex);
      setImages(reordered);
    }
  };

  return (
    <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
      <SortableContext items={images.map((img: any) => img.id)} strategy={verticalListSortingStrategy}>
        {images.map((img: any, index: number) => (
          <SortableItem key={img.id} image={img} index={index} />
        ))}
      </SortableContext>
    </DndContext>
  );
}
