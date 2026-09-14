'use client';

import Link from 'next/link';
import { Edit2, Trash2 } from 'lucide-react';
import { useState } from 'react';
import { deleteProductAdmin } from './actions';

export default function ProductRowActions({ id }: { id: string }) {
  const [isDeleting, setIsDeleting] = useState(false);

  const handleDelete = async () => {
    if (window.confirm('Are you sure you want to delete this product? Historical orders will be preserved.')) {
      setIsDeleting(true);
      try {
        await deleteProductAdmin(id);
      } catch (error) {
        alert('Failed to delete product.');
        setIsDeleting(false);
      }
    }
  };

  return (
    <div className="flex justify-end gap-2">
      <Link 
        href={`/admin/products/${id}`}
        className="inline-flex p-2 text-slate-400 hover:text-amber-500 transition-colors bg-white hover:bg-amber-50 rounded-lg shadow-sm border border-slate-200 hover:border-amber-200"
      >
        <Edit2 size={16} />
      </Link>
      <button 
        onClick={handleDelete}
        disabled={isDeleting}
        className="inline-flex p-2 text-slate-400 hover:text-red-500 transition-colors bg-white hover:bg-red-50 rounded-lg shadow-sm border border-slate-200 hover:border-red-200 disabled:opacity-50"
      >
        <Trash2 size={16} />
      </button>
    </div>
  );
}
