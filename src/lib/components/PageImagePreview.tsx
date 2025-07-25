import React from 'react';

export default function PageImagePreview({ image, index, onChangeTag }: any) {
  return (
    <div className="mb-4 border rounded p-2">
      <img src={image.preview} alt="Preview" className="w-40 mb-2" />
      <div className="grid grid-cols-3 gap-2">
        {[0, 1, 2].map((i) => (
          <input
            key={i}
            type="text"
            className="border rounded p-1 w-full text-sm"
            placeholder={`Tag ${i + 1}`}
            value={image.tags[i] || ''}
            onChange={(e) => onChangeTag(index, i, e.target.value)}
          />
        ))}
      </div>
    </div>
  );
}
