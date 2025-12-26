import { useState } from "react";
import axiosInstance from "../utils/axiosInstance";

export default function CreateCommunityPost({ communityId, setPosts }) {
  const [content, setContent] = useState("");
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!content.trim() && !file) return;

    const formData = new FormData();
    formData.append("content", content);
    formData.append("communityId", communityId);
    if (file) formData.append("file", file);

    try {
      setLoading(true);
      const res = await axiosInstance.post("/posts", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      setPosts((prev) => [res.data, ...prev]);
      setContent("");
      setFile(null);
    }catch (err) {
  console.error("Post error:", err.response?.data || err);
  alert(err.response?.data?.message || "Failed to create post");
} finally {
      setLoading(false);
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="p-4 space-y-3 bg-white shadow rounded-xl"
    >
      <textarea
        className="w-full p-3 border rounded-xl"
        placeholder="Write something..."
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

      <button
        type="submit"
        disabled={loading}
        className="px-5 py-2 text-white bg-indigo-500 rounded-xl"
      >
        {loading ? "Posting..." : "Post"}
      </button>
    </form>
  );
}
