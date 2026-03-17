'use client';

import { useState } from 'react';
import { Upload, X, ImageIcon, Loader2 } from 'lucide-react';
import Image from 'next/image';
import axios from 'axios';

interface ImageUploadProps {
  value: string;
  onChange: (url: string) => void;
}

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';

export default function ImageUpload({ value, onChange }: ImageUploadProps) {
  const [uploading, setUploading] = useState(false);

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    const formData = new FormData();
    formData.append('image', file);

    try {
      const res = await axios.post(`${API_URL}/upload`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      onChange(res.data.url);
    } catch (err) {
      console.error('Upload failed:', err);
      alert('Failed to upload image. Please try again.');
    } finally {
      setUploading(false);
    }
  };

  const handleRemove = () => {
    onChange('');
  };

  return (
    <div className="space-y-4 w-full">
      <label className="block text-sm font-bold text-gray-700 mb-2 uppercase tracking-tight">Product Image</label>
      
      {value ? (
        <div className="relative w-full aspect-square md:aspect-video rounded-2xl overflow-hidden border-2 border-indigo-100 group">
          <Image 
            src={value.startsWith('http') ? value : `${process.env.NEXT_PUBLIC_API_URL?.replace('/api', '')}${value}`} 
            alt="Upload" 
            fill 
            className="object-cover" 
          />
          <button 
            onClick={handleRemove}
            className="absolute top-4 right-4 bg-red-500 text-white p-2 rounded-full shadow-lg opacity-0 group-hover:opacity-100 transition-opacity"
          >
            <X size={20} />
          </button>
        </div>
      ) : (
        <label className="flex flex-col items-center justify-center w-full aspect-square md:aspect-video border-2 border-dashed border-gray-200 rounded-2xl cursor-pointer hover:border-indigo-400 hover:bg-indigo-50/50 transition-all group">
          <div className="flex flex-col items-center justify-center pt-5 pb-6">
            {uploading ? (
              <Loader2 className="w-10 h-10 text-indigo-500 animate-spin mb-4" />
            ) : (
              <Upload className="w-10 h-10 text-gray-300 group-hover:text-indigo-400 mb-4 transition-colors" />
            )}
            <p className="mb-2 text-sm text-gray-500"><span className="font-bold">Click to upload</span> or drag and drop</p>
            <p className="text-xs text-gray-400 lowercase">PNG, JPG, WEBP (MAX. 5MB)</p>
          </div>
          <input type="file" className="hidden" onChange={handleUpload} disabled={uploading} accept="image/*" />
        </label>
      )}
    </div>
  );
}
