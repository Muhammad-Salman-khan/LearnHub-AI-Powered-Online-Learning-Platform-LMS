"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { CreateChapters, courseUpdateFields } from "@/server/action";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";

interface Chapter {
  id: string;
  title: string;
  description: string | null;
  videoUrl: string | null;
  content: string | null;
  position: number;
  isFree: boolean;
  isPublished: boolean;
  courseId: string;
}

export default function ChapterManager({
  courseId,
  courseTitle,
  initialChapters,
}: {
  courseId: string;
  courseTitle: string;
  initialChapters: Chapter[];
}) {
  const router = useRouter();
  const [chapters, setChapters] = useState<Chapter[]>(initialChapters);
  const [showForm, setShowForm] = useState(false);
  const [loading, setLoading] = useState(false);
  const [editingChapter, setEditingChapter] = useState<Chapter | null>(null);

  // Form state
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [content, setContent] = useState("");
  const [videoUrl, setVideoUrl] = useState("");
  const [isPublished, setIsPublished] = useState(false);

  const resetForm = () => {
    setTitle("");
    setDescription("");
    setContent("");
    setVideoUrl("");
    setIsPublished(false);
    setEditingChapter(null);
    setShowForm(false);
  };

  const handleEditChapter = (chapter: Chapter) => {
    setEditingChapter(chapter);
    setTitle(chapter.title);
    setDescription(chapter.description || "");
    setContent(chapter.content || "");
    setVideoUrl(chapter.videoUrl || "");
    setIsPublished(chapter.isPublished);
    setShowForm(true);
  };

  const handleUpdateChapter = async () => {
    if (!title.trim()) {
      toast.error("Chapter title is required");
      return;
    }

    if (!editingChapter) return;

    setLoading(true);
    const oldData = { ...editingChapter };

    // Instantly update local state
    setChapters((prev) =>
      prev.map((ch) =>
        ch.id === editingChapter.id
          ? { ...ch, title, description, content, videoUrl, isPublished }
          : ch
      )
    );

    try {
      const res = await fetch("/api/chapters/" + editingChapter.id, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title, description, content, videoUrl, isPublished }),
      });

      if (res.ok) {
        toast.success("Chapter updated successfully");
        resetForm();
      } else {
        toast.error("Failed to update chapter");
        // Revert
        setChapters((prev) =>
          prev.map((ch) =>
            ch.id === oldData.id ? oldData : ch
          )
        );
      }
    } catch (error) {
      toast.error("Something went wrong");
      // Revert
      setChapters((prev) =>
        prev.map((ch) =>
          ch.id === oldData.id ? oldData : ch
        )
      );
    } finally {
      setLoading(false);
    }
  };

  const handleAddChapter = async () => {
    if (!title.trim()) {
      toast.error("Chapter title is required");
      return;
    }

    setLoading(true);
    try {
      const res = await CreateChapters(courseId, {
        title,
        description: description || undefined,
        content: content || undefined,
        videoUrl: videoUrl || undefined,
        position: chapters.length,
        isFree: false,
        isPublished,
      });

      if (res.success && res.data) {
        toast.success("Chapter added successfully");
        // Instantly add to local state
        setChapters((prev) => [...prev, res.data as Chapter]);
        // Reset form
        setTitle("");
        setDescription("");
        setContent("");
        setVideoUrl("");
        setIsPublished(false);
        setShowForm(chapters.length > 0); // Keep form open if chapters exist for "Add Another"
      } else {
        toast.error(res.error || "Failed to add chapter");
      }
    } catch (error) {
      toast.error("Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteChapter = async (chapterId: string) => {
    if (!confirm("Are you sure you want to delete this chapter?")) return;

    // Instantly remove from local state
    const deletedChapter = chapters.find((ch) => ch.id === chapterId);
    setChapters((prev) => prev.filter((ch) => ch.id !== chapterId));

    try {
      const res = await fetch("/api/chapters/" + chapterId, { method: "DELETE" });
      if (res.ok) {
        toast.success("Chapter deleted");
      } else {
        toast.error("Failed to delete chapter");
        // Revert if server fails
        if (deletedChapter) {
          setChapters((prev) => [...prev, deletedChapter]);
        }
      }
    } catch (error) {
      toast.error("Something went wrong");
      // Revert if server fails
      if (deletedChapter) {
        setChapters((prev) => [...prev, deletedChapter]);
      }
    }
  };

  const handleTogglePublish = async (chapterId: string, currentStatus: boolean) => {
    const newStatus = !currentStatus;
    
    // Instantly update local state
    setChapters((prev) =>
      prev.map((ch) =>
        ch.id === chapterId ? { ...ch, isPublished: newStatus } : ch
      )
    );

    try {
      const res = await fetch("/api/chapters/" + chapterId, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ isPublished: newStatus }),
      });
      if (res.ok) {
        toast.success(newStatus ? "Chapter published" : "Chapter unpublished");
      } else {
        toast.error("Failed to update chapter");
        // Revert if server fails
        setChapters((prev) =>
          prev.map((ch) =>
            ch.id === chapterId ? { ...ch, isPublished: currentStatus } : ch
          )
        );
      }
    } catch (error) {
      toast.error("Failed to update chapter");
      // Revert if server fails
      setChapters((prev) =>
        prev.map((ch) =>
          ch.id === chapterId ? { ...ch, isPublished: currentStatus } : ch
        )
      );
    }
  };

  const moveChapterUp = async (index: number) => {
    if (index === 0) return;
    
    const newChapters = [...chapters];
    [newChapters[index], newChapters[index - 1]] = [newChapters[index - 1], newChapters[index]];
    newChapters.forEach((ch, i) => (ch.position = i));
    
    // Instantly update local state
    setChapters(newChapters);
    
    // Save to DB in background
    try {
      await Promise.all(
        newChapters.map((ch) =>
          fetch("/api/chapters/" + ch.id, {
            method: "PATCH",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ position: ch.position }),
          })
        )
      );
    } catch (error) {
      toast.error("Failed to reorder chapters");
    }
  };

  const moveChapterDown = async (index: number) => {
    if (index === chapters.length - 1) return;
    
    const newChapters = [...chapters];
    [newChapters[index], newChapters[index + 1]] = [newChapters[index + 1], newChapters[index]];
    newChapters.forEach((ch, i) => (ch.position = i));
    
    // Instantly update local state
    setChapters(newChapters);
    
    // Save to DB in background
    try {
      await Promise.all(
        newChapters.map((ch) =>
          fetch("/api/chapters/" + ch.id, {
            method: "PATCH",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ position: ch.position }),
          })
        )
      );
    } catch (error) {
      toast.error("Failed to reorder chapters");
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground">{courseTitle}</h1>
          <p className="text-muted-foreground mt-1">
            {chapters.length} chapter{chapters.length !== 1 ? "s" : ""} • Add, arrange, and manage your course content
          </p>
        </div>
        <Button
          onClick={() => setShowForm(!showForm)}
          className="bg-[#F97316] hover:bg-[#F97316]/90 text-white"
        >
          <span className="material-symbols-outlined text-sm mr-2">add</span>
          {chapters.length === 0 ? "Add First Chapter" : showForm ? "Cancel" : "Add Chapter"}
        </Button>
      </div>

      {/* Add/Edit Chapter Form */}
      {showForm && (
        <div className="glass-card rounded-xl p-6 border border-border">
          <h2 className="text-lg font-semibold mb-4">
            {editingChapter ? "Edit Chapter" : chapters.length === 0 ? "Create Your First Chapter" : "Add New Chapter"}
          </h2>
          <div className="space-y-4">
            <div>
              <Label htmlFor="chapter-title">Chapter Title *</Label>
              <Input
                id="chapter-title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="e.g., Introduction to React"
                className="mt-1"
              />
            </div>

            <div>
              <Label htmlFor="chapter-desc">Description</Label>
              <Textarea
                id="chapter-desc"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Brief description of this chapter"
                className="mt-1"
              />
            </div>

            <div>
              <Label htmlFor="chapter-content">Content</Label>
              <Textarea
                id="chapter-content"
                value={content}
                onChange={(e) => setContent(e.target.value)}
                placeholder="Chapter content/notes"
                className="mt-1"
                rows={4}
              />
            </div>

            <div>
              <Label htmlFor="chapter-video">Video URL (YouTube embed URL)</Label>
              <Input
                id="chapter-video"
                value={videoUrl}
                onChange={(e) => setVideoUrl(e.target.value)}
                placeholder="e.g., https://www.youtube.com/embed/..."
                className="mt-1"
              />
            </div>

            <div className="flex items-center gap-2">
              <Switch checked={isPublished} onCheckedChange={setIsPublished} />
              <Label>Published (students can see this chapter)</Label>
            </div>

            <div className="flex justify-end gap-3 pt-4">
              <Button
                variant="outline"
                onClick={resetForm}
              >
                Cancel
              </Button>
              <Button
                onClick={editingChapter ? handleUpdateChapter : handleAddChapter}
                disabled={loading}
                className="bg-[#F97316] hover:bg-[#F97316]/90 text-white"
              >
                {loading ? "Saving..." : editingChapter ? "Update Chapter" : chapters.length === 0 ? "Create Chapter" : "Add Another Chapter"}
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Chapters List */}
      {chapters.length > 0 && (
        <div className="space-y-3">
          <h2 className="text-lg font-semibold">Existing Chapters</h2>
          <div className="space-y-2">
            {chapters.map((chapter, index) => (
              <div
                key={chapter.id}
                className="glass-card rounded-lg p-4 border border-border flex items-center gap-4"
              >
                {/* Position Number */}
                <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center text-primary font-bold">
                  {index + 1}
                </div>

                {/* Chapter Info */}
                <div className="flex-1 min-w-0">
                  <h3 className="font-medium text-foreground truncate">
                    {chapter.title}
                  </h3>
                  <p className="text-xs text-muted-foreground truncate">
                    {chapter.description || "No description"}
                  </p>
                </div>

                {/* Status Badge */}
                <span
                  className={`px-2 py-1 rounded text-xs font-medium ${
                    chapter.isPublished
                      ? "bg-green-500/10 text-green-500 border border-green-500/20"
                      : "bg-yellow-500/10 text-yellow-500 border border-yellow-500/20"
                  }`}
                >
                  {chapter.isPublished ? "Published" : "Draft"}
                </span>

                {/* Action Buttons */}
                <div className="flex items-center gap-1">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleEditChapter(chapter)}
                    className="h-8 w-8 p-0 text-blue-400 hover:text-blue-300 hover:bg-blue-400/10"
                  >
                    <span className="material-symbols-outlined text-base">edit</span>
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => moveChapterUp(index)}
                    disabled={index === 0}
                    className="h-8 w-8 p-0"
                  >
                    <span className="material-symbols-outlined text-base">arrow_upward</span>
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => moveChapterDown(index)}
                    disabled={index === chapters.length - 1}
                    className="h-8 w-8 p-0"
                  >
                    <span className="material-symbols-outlined text-base">arrow_downward</span>
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleTogglePublish(chapter.id, chapter.isPublished)}
                    className="h-8 w-8 p-0"
                  >
                    <span className="material-symbols-outlined text-base">
                      {chapter.isPublished ? "visibility" : "visibility_off"}
                    </span>
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleDeleteChapter(chapter.id)}
                    className="h-8 w-8 p-0 text-destructive hover:text-destructive hover:bg-destructive/10"
                  >
                    <span className="material-symbols-outlined text-base">delete</span>
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {chapters.length === 0 && !showForm && (
        <div className="text-center py-16 glass-card-no-glow rounded-xl">
          <span className="material-symbols-outlined text-6xl text-muted-foreground mb-4">
            menu_book
          </span>
          <h3 className="text-xl font-semibold text-foreground mb-2">No chapters yet</h3>
          <p className="text-muted-foreground mb-6">
            Start building your course by adding your first chapter.
          </p>
          <Button
            onClick={() => setShowForm(true)}
            className="bg-[#F97316] hover:bg-[#F97316]/90 text-white"
          >
            <span className="material-symbols-outlined text-sm mr-2">add</span>
            Add First Chapter
          </Button>
        </div>
      )}
    </div>
  );
}
