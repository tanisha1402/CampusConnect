import { useState } from "react";
import axiosInstance from "../utils/axiosInstance";

export default function CommentsModal({ post, onClose, setPosts }) {
  const [text, setText] = useState("");
  const [loading, setLoading] = useState(false);

  const addComment = async () => {
    if (!text.trim()) return;

    try {
      setLoading(true);

      const res = await axiosInstance.post(
        `/posts/${post._id}/comments`,
        { text }
      );

      // Update post inside posts state
      setPosts(prev =>
        prev.map(p => (p._id === post._id ? res.data : p))
      );

      setText("");
      setLoading(false);
    } catch (err) {
      console.error("Add comment error", err);
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
      <div className="w-full max-w-lg p-6 bg-white shadow-lg rounded-xl">
        
        {/* Header */}
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-bold">Comments</h2>
          <button
            onClick={onClose}
            className="text-slate-500 hover:text-black"
          >
            ✕
          </button>
        </div>

        {/* Comments List */}
        <div className="space-y-3 overflow-y-auto max-h-64">
          {post.comments?.length === 0 ? (
            <p className="text-sm text-slate-500">No comments yet</p>
          ) : (
            post.comments.map((c, i) => (
              <div key={i} className="p-3 rounded-lg bg-slate-100">
                <p className="text-sm font-semibold">{c.user.name}</p>
                <p className="text-sm">{c.text}</p>
              </div>
            ))
          )}
        </div>

        {/* Add Comment */}
        <div className="flex gap-2 mt-4">
          <input
            className="flex-1 p-2 border rounded-lg"
            placeholder="Write a comment..."
            value={text}
            onChange={(e) => setText(e.target.value)}
          />
          <button
            onClick={addComment}
            disabled={loading}
            className="px-4 py-2 text-white bg-indigo-600 rounded-lg"
          >
            {loading ? "..." : "Post"}
          </button>
        </div>
      </div>
    </div>
  );
}
