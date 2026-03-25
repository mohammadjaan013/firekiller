"use client";

import { useRouter } from "next/navigation";
import { Trash2 } from "lucide-react";

export default function DeleteBlogButton({
  id,
  title,
}: {
  id: string;
  title: string;
}) {
  const router = useRouter();

  const handleDelete = async () => {
    if (!confirm(`Delete "${title}"? This cannot be undone.`)) return;

    const res = await fetch(`/api/admin/blogs/${id}`, { method: "DELETE" });
    if (res.ok) {
      router.refresh();
    } else {
      alert("Failed to delete post");
    }
  };

  return (
    <button
      onClick={handleDelete}
      className="p-1.5 text-red-500 hover:bg-red-50 rounded-lg transition-colors"
      title="Delete"
    >
      <Trash2 className="h-3.5 w-3.5" />
    </button>
  );
}
