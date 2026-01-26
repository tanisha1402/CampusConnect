import { useState } from "react";
import axiosInstance from "../utils/axiosInstance";

export default function CreatePostModal({
  onClose,
  communityId = null,
  setPosts,
}) {
  const [content, setContent] = useState("");
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!content.trim() && !file) return;

    const formData = new FormData();
    formData.append("content", content);
    if (communityId) formData.append("communityId", communityId);
    if (file) formData.append("file", file);

    try {
      setLoading(true);
      const res = await axiosInstance.post("/posts", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      setPosts((prev) => [res.data, ...prev]);
      setContent("");
      setFile(null);
      onClose();
    } catch (err) {
      console.error("Post error:", err.response?.data || err);
      alert(err.response?.data?.message || "Failed to create post");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
      <div className="w-full max-w-lg p-6 bg-white shadow-xl rounded-2xl">
        {/* HEADER */}
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-bold">Create Post</h2>
          <button
            onClick={onClose}
            className="text-slate-500 hover:text-black"
          >
            ✕
          </button>
        </div>

        {/* BODY */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <textarea
            className="w-full p-3 border rounded-xl focus:ring-2 focus:ring-indigo-400"
            placeholder="What's on your mind?"
            rows={4}
            value={content}
            onChange={(e) => setContent(e.target.value)}
          />

          <input
            type="file"
            accept="image/*,.pdf"
            onChange={(e) => setFile(e.target.files[0])}
          />

          {file && (
            <p className="text-sm text-slate-500">
              Selected: {file.name}
            </p>
          )}

          <div className="flex justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-lg bg-slate-200 hover:bg-slate-300"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="px-5 py-2 text-white bg-indigo-600 rounded-lg hover:bg-indigo-700"
            >
              {loading ? "Posting..." : "Post"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}