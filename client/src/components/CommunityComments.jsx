// src/components/CommunityComments.jsx
import { useState } from "react";
import axiosInstance from "../utils/axiosInstance";

export default function CommunityComments({ post, setPosts }) {
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

      setPosts(prev =>
  prev.map(p =>
    p._id === post._id ? { ...res.data, user: p.user } : p
  )
);


      setText("");
      setLoading(false);
    } catch (err) {
      console.error("Comment error", err);
      setLoading(false);
    }
  };

  return (
    <div className="mt-4 space-y-3">
      {/* Existing comments */}
      {post.comments?.map((c, i) => (
        <div
          key={i}
          className="px-3 py-2 text-sm rounded-lg bg-slate-100"
        >
          <span className="font-semibold">{c.user.name}</span>{" "}
          <span className="text-slate-700">{c.text}</span>
        </div>
      ))}

      {/* Add comment */}
      <div className="flex items-center gap-2">
        <input
          className="flex-1 px-3 py-2 text-sm border rounded-full focus:outline-none focus:ring-2 focus:ring-indigo-400"
          placeholder="Write a comment..."
          value={text}
          onChange={(e) => setText(e.target.value)}
        />
        <button
          onClick={addComment}
          disabled={loading}
          className="px-4 py-2 text-sm text-white bg-indigo-500 rounded-full hover:bg-indigo-600 disabled:opacity-50"
        >
          Send
        </button>
      </div>
    </div>
  );
}
