"use client";

import { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import ReactMarkdown from "react-markdown";
import {
  ArrowLeft,
  Save,
  Eye,
  EyeOff,
  FileText,
  Bold,
  Italic,
  Heading1,
  Heading2,
  Heading3,
  List,
  ListOrdered,
  Quote,
  Code,
  Link as LinkIcon,
  Image as ImageIcon,
  Table,
  Minus,
} from "lucide-react";

const CATEGORIES = ["PanSafe", "FireKiller", "General"] as const;

interface BlogFormData {
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  coverImage: string;
  category: string;
  readTime: string;
  isPublished: boolean;
}

function generateSlug(title: string): string {
  return title
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")
    .slice(0, 80);
}

function estimateReadTime(content: string): string {
  const words = content.split(/\s+/).length;
  const minutes = Math.max(1, Math.ceil(words / 200));
  return `${minutes} min read`;
}

// Toolbar for markdown editing
function ToolbarButton({
  icon: Icon,
  label,
  onClick,
}: {
  icon: React.ComponentType<{ className?: string }>;
  label: string;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="p-1.5 rounded hover:bg-muted transition-colors text-muted-foreground hover:text-secondary"
      title={label}
    >
      <Icon className="h-4 w-4" />
    </button>
  );
}

export default function BlogEditor({
  initialData,
  postId,
}: {
  initialData?: BlogFormData;
  postId?: string;
}) {
  const router = useRouter();
  const isEditing = !!postId;

  const [form, setForm] = useState<BlogFormData>(
    initialData || {
      title: "",
      slug: "",
      excerpt: "",
      content: "",
      coverImage: "",
      category: "General",
      readTime: "5 min read",
      isPublished: false,
    }
  );

  const [preview, setPreview] = useState(false);
  const [saving, setSaving] = useState(false);
  const [autoSlug, setAutoSlug] = useState(!isEditing);

  // Auto-generate slug from title
  useEffect(() => {
    if (autoSlug && form.title) {
      setForm((prev) => ({ ...prev, slug: generateSlug(prev.title) }));
    }
  }, [form.title, autoSlug]);

  // Auto-estimate read time from content
  useEffect(() => {
    if (form.content) {
      setForm((prev) => ({ ...prev, readTime: estimateReadTime(prev.content) }));
    }
  }, [form.content]);

  const updateField = useCallback(
    (field: keyof BlogFormData, value: string | boolean) => {
      setForm((prev) => ({ ...prev, [field]: value }));
      if (field === "slug") setAutoSlug(false);
    },
    []
  );

  // Markdown toolbar actions
  const insertMarkdown = useCallback(
    (before: string, after: string = "", placeholder = "") => {
      const textarea = document.getElementById(
        "blog-content"
      ) as HTMLTextAreaElement;
      if (!textarea) return;

      const start = textarea.selectionStart;
      const end = textarea.selectionEnd;
      const selected = textarea.value.substring(start, end);
      const text = selected || placeholder;
      const newValue =
        textarea.value.substring(0, start) +
        before +
        text +
        after +
        textarea.value.substring(end);

      setForm((prev) => ({ ...prev, content: newValue }));

      // Restore cursor position
      setTimeout(() => {
        textarea.focus();
        const newPos = start + before.length + text.length;
        textarea.setSelectionRange(newPos, newPos);
      }, 0);
    },
    []
  );

  const handleSave = async (publish?: boolean) => {
    if (!form.title.trim() || !form.slug.trim() || !form.content.trim()) {
      alert("Title, slug, and content are required.");
      return;
    }

    setSaving(true);
    const payload = {
      ...form,
      isPublished: publish !== undefined ? publish : form.isPublished,
    };

    try {
      const url = isEditing
        ? `/api/admin/blogs/${postId}`
        : "/api/admin/blogs";
      const method = isEditing ? "PUT" : "POST";

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (res.ok) {
        router.push("/admin/blogs");
        router.refresh();
      } else {
        const data = await res.json();
        alert(data.error || "Failed to save");
      }
    } catch {
      alert("Failed to save blog post");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <Link
            href="/admin/blogs"
            className="p-2 rounded-lg hover:bg-muted transition-colors"
          >
            <ArrowLeft className="h-5 w-5 text-muted-foreground" />
          </Link>
          <h1 className="text-xl font-bold text-secondary">
            {isEditing ? "Edit Post" : "New Post"}
          </h1>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => handleSave(false)}
            disabled={saving}
            className="px-4 py-2 text-sm font-medium border border-border rounded-xl hover:bg-muted transition-colors disabled:opacity-50"
          >
            Save Draft
          </button>
          <button
            onClick={() => handleSave(true)}
            disabled={saving}
            className="inline-flex items-center gap-2 px-4 py-2 bg-primary text-white text-sm font-semibold rounded-xl hover:bg-primary-dark transition-colors disabled:opacity-50"
          >
            <Save className="h-4 w-4" />
            {saving ? "Saving..." : "Publish"}
          </button>
        </div>
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Main editor */}
        <div className="lg:col-span-2 space-y-4">
          {/* Title */}
          <input
            type="text"
            value={form.title}
            onChange={(e) => updateField("title", e.target.value)}
            placeholder="Post title..."
            className="w-full text-2xl font-bold bg-transparent border-0 border-b-2 border-border focus:border-primary focus:outline-none pb-3 text-secondary placeholder:text-muted-foreground/50"
          />

          {/* Slug */}
          <div className="flex items-center gap-2 text-sm">
            <span className="text-muted-foreground shrink-0">/blog/</span>
            <input
              type="text"
              value={form.slug}
              onChange={(e) =>
                updateField("slug", e.target.value.toLowerCase().replace(/[^a-z0-9-]/g, ""))
              }
              className="flex-1 px-2 py-1 bg-muted rounded border border-border text-xs font-mono focus:outline-none focus:ring-1 focus:ring-primary/30"
            />
          </div>

          {/* Excerpt */}
          <textarea
            value={form.excerpt}
            onChange={(e) => updateField("excerpt", e.target.value)}
            placeholder="Brief excerpt / description (shown on blog listing & SEO)..."
            rows={2}
            className="w-full px-4 py-3 bg-white rounded-xl border border-border text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 resize-none"
          />

          {/* Content editor with toolbar */}
          <div className="bg-white rounded-xl border border-border overflow-hidden">
            {/* Toolbar + Preview toggle */}
            <div className="flex items-center justify-between border-b border-border px-3 py-2">
              <div className="flex items-center gap-0.5 flex-wrap">
                <ToolbarButton
                  icon={Bold}
                  label="Bold"
                  onClick={() => insertMarkdown("**", "**", "bold text")}
                />
                <ToolbarButton
                  icon={Italic}
                  label="Italic"
                  onClick={() => insertMarkdown("*", "*", "italic text")}
                />
                <div className="w-px h-5 bg-border mx-1" />
                <ToolbarButton
                  icon={Heading1}
                  label="Heading 1"
                  onClick={() => insertMarkdown("\n## ", "\n", "Heading")}
                />
                <ToolbarButton
                  icon={Heading2}
                  label="Heading 2"
                  onClick={() => insertMarkdown("\n### ", "\n", "Heading")}
                />
                <ToolbarButton
                  icon={Heading3}
                  label="Heading 3"
                  onClick={() => insertMarkdown("\n#### ", "\n", "Heading")}
                />
                <div className="w-px h-5 bg-border mx-1" />
                <ToolbarButton
                  icon={List}
                  label="Bullet List"
                  onClick={() => insertMarkdown("\n- ", "", "item")}
                />
                <ToolbarButton
                  icon={ListOrdered}
                  label="Numbered List"
                  onClick={() => insertMarkdown("\n1. ", "", "item")}
                />
                <ToolbarButton
                  icon={Quote}
                  label="Blockquote"
                  onClick={() => insertMarkdown("\n> ", "", "quote")}
                />
                <div className="w-px h-5 bg-border mx-1" />
                <ToolbarButton
                  icon={Code}
                  label="Code"
                  onClick={() => insertMarkdown("`", "`", "code")}
                />
                <ToolbarButton
                  icon={LinkIcon}
                  label="Link"
                  onClick={() => insertMarkdown("[", "](https://)", "link text")}
                />
                <ToolbarButton
                  icon={ImageIcon}
                  label="Image"
                  onClick={() => insertMarkdown("![", "](https://image-url)", "alt text")}
                />
                <ToolbarButton
                  icon={Table}
                  label="Table"
                  onClick={() =>
                    insertMarkdown(
                      "\n| Column 1 | Column 2 | Column 3 |\n|----------|----------|----------|\n| Cell 1   | Cell 2   | Cell 3   |\n",
                      ""
                    )
                  }
                />
                <ToolbarButton
                  icon={Minus}
                  label="Horizontal Rule"
                  onClick={() => insertMarkdown("\n---\n", "")}
                />
              </div>
              <button
                onClick={() => setPreview(!preview)}
                className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-lg transition-colors ${
                  preview
                    ? "bg-primary text-white"
                    : "bg-muted text-secondary hover:bg-muted"
                }`}
              >
                {preview ? (
                  <>
                    <EyeOff className="h-3 w-3" /> Edit
                  </>
                ) : (
                  <>
                    <Eye className="h-3 w-3" /> Preview
                  </>
                )}
              </button>
            </div>

            {preview ? (
              <div className="p-6 min-h-[400px] prose prose-sm max-w-none prose-headings:text-secondary prose-a:text-primary prose-strong:text-secondary">
                <ReactMarkdown>{form.content}</ReactMarkdown>
              </div>
            ) : (
              <textarea
                id="blog-content"
                value={form.content}
                onChange={(e) => updateField("content", e.target.value)}
                placeholder="Write your article in Markdown...

## Getting Started
Start writing here. Use the toolbar above or type Markdown directly.

- **Bold** with **text**
- *Italic* with *text*
- [Links](https://example.com)
- ![Images](https://image-url)

### Tips
- Use ## for main headings
- Use ### for sub-headings
- Use - for bullet lists
- Use > for quotes"
                rows={20}
                className="w-full px-4 py-4 text-sm font-mono leading-relaxed focus:outline-none resize-y min-h-[400px]"
              />
            )}
          </div>
        </div>

        {/* Sidebar settings */}
        <div className="space-y-4">
          {/* Status card */}
          <div className="bg-white rounded-xl border border-border p-5">
            <h3 className="text-sm font-semibold text-secondary mb-3 flex items-center gap-2">
              <FileText className="h-4 w-4 text-primary" />
              Post Settings
            </h3>

            {/* Category */}
            <div className="mb-4">
              <label className="block text-xs font-medium text-muted-foreground mb-1.5">
                Category
              </label>
              <select
                value={form.category}
                onChange={(e) => updateField("category", e.target.value)}
                className="w-full px-3 py-2 bg-muted rounded-lg border border-border text-sm focus:outline-none focus:ring-2 focus:ring-primary/20"
              >
                {CATEGORIES.map((cat) => (
                  <option key={cat} value={cat}>
                    {cat}
                  </option>
                ))}
              </select>
            </div>

            {/* Cover Image */}
            <div className="mb-4">
              <label className="block text-xs font-medium text-muted-foreground mb-1.5">
                Cover Image URL
              </label>
              <input
                type="text"
                value={form.coverImage}
                onChange={(e) => updateField("coverImage", e.target.value)}
                placeholder="https://example.com/image.jpg"
                className="w-full px-3 py-2 bg-muted rounded-lg border border-border text-sm focus:outline-none focus:ring-2 focus:ring-primary/20"
              />
              {form.coverImage && (
                <div className="mt-2 relative h-32 rounded-lg overflow-hidden border border-border">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={form.coverImage}
                    alt="Cover preview"
                    className="w-full h-full object-cover"
                  />
                </div>
              )}
            </div>

            {/* Read time */}
            <div className="mb-4">
              <label className="block text-xs font-medium text-muted-foreground mb-1.5">
                Read Time
              </label>
              <input
                type="text"
                value={form.readTime}
                onChange={(e) => updateField("readTime", e.target.value)}
                className="w-full px-3 py-2 bg-muted rounded-lg border border-border text-sm focus:outline-none focus:ring-2 focus:ring-primary/20"
              />
              <p className="text-[10px] text-muted-foreground mt-1">
                Auto-calculated from content length
              </p>
            </div>

            {/* Publish toggle */}
            <div className="flex items-center justify-between py-3 border-t border-border">
              <span className="text-sm font-medium text-secondary">
                Published
              </span>
              <button
                onClick={() => updateField("isPublished", !form.isPublished)}
                className={`relative w-10 h-5 rounded-full transition-colors ${
                  form.isPublished ? "bg-green-500" : "bg-gray-300"
                }`}
              >
                <span
                  className={`absolute top-0.5 left-0.5 w-4 h-4 bg-white rounded-full shadow-sm transition-transform ${
                    form.isPublished ? "translate-x-5" : "translate-x-0"
                  }`}
                />
              </button>
            </div>
          </div>

          {/* Markdown cheatsheet */}
          <div className="bg-white rounded-xl border border-border p-5">
            <h3 className="text-sm font-semibold text-secondary mb-3">
              Markdown Reference
            </h3>
            <div className="space-y-2 text-xs text-muted-foreground font-mono">
              <p>## Heading 2</p>
              <p>### Heading 3</p>
              <p>**bold** / *italic*</p>
              <p>- bullet list</p>
              <p>1. numbered list</p>
              <p>{"> blockquote"}</p>
              <p>[text](url)</p>
              <p>![alt](image-url)</p>
              <p>| Col | Col |</p>
              <p>---</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
