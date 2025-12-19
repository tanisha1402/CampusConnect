import { useState } from "react";
import axiosInstance from "../utils/axiosInstance";

export default function CreateCommunityPost({ communityId, setPosts }) {
  const [content, setContent] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!content.trim()) return;

    try {
      setLoading(true);

     const res = await axiosInstance.post("/posts", {
  content,
  communityId: communityId,
});

      // Add new post to top of feed
      setPosts((prev) => [res.data, ...prev]);

      setContent("");
      setLoading(false);
    } catch (err) {
      console.error("Error creating community post", err);
      setLoading(false);
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="p-4 space-y-3 bg-white border shadow-sm rounded-xl"
    >
      <textarea
        className="w-full p-3 border rounded-xl"
        placeholder="Write something for this community..."
        value={content}
        onChange={(e) => setContent(e.target.value)}
      />

      <button
        type="submit"
        disabled={loading}
        className="px-5 py-2 text-white bg-indigo-500 rounded-xl hover:bg-indigo-600"
      >
        {loading ? "Posting..." : "Post"}
      </button>
    </form>
  );
}
