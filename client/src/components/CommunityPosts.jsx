import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axiosInstance from "../utils/axiosInstance";
import CommentsModal from "./CommentsModal";

export default function CommunityPosts({ posts, setPosts }) {
  const [activePost, setActivePost] = useState(null);
  const navigate = useNavigate();

  const handleLike = async (postId) => {
    const res = await axiosInstance.post(`/posts/${postId}/like`);
    setPosts((prev) =>
      prev.map((p) => (p._id === postId ? res.data : p))
    );
  };

  return (
    <>
      <div className="space-y-4">
        <h2 className="text-2xl font-bold">Posts</h2>

        {posts.length === 0 ? (
          <p className="text-slate-500">No posts yet.</p>
        ) : (
          posts.map((post) => (
            <div
              key={post._id}
              className="p-4 bg-white shadow rounded-xl"
            >
              {/* USER HEADER */}
              <div className="flex items-center gap-3 mb-2">
                <div className="flex items-center justify-center w-10 h-10 font-semibold text-white bg-indigo-400 rounded-full">
                  {post.user.name.charAt(0).toUpperCase()}
                </div>

                <div>
                  <p
                    className="font-semibold text-indigo-600 cursor-pointer hover:underline"
                    onClick={() =>
                      navigate(`/profile/${post.user._id}`)
                    }
                  >
                    {post.user.name}
                  </p>
                  <p className="text-xs text-slate-500">
                    {new Date(post.createdAt).toLocaleString()}
                  </p>
                </div>
              </div>

              {/* CONTENT */}
              <p className="mt-2">{post.content}</p>

              {/* FILE PREVIEW */}
              {post.file?.type === "image" && (
                <img
                  src={`http://localhost:5000${post.file.url}`}
                  alt="post upload"
                  className="object-cover mt-3 border rounded-xl max-h-96"
                />
              )}

              {post.file?.type === "file" && (
                <a
                  href={`http://localhost:5000${post.file.url}`}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-2 mt-3 text-indigo-600 hover:underline"
                >
                  📎 {post.file.name}
                </a>
              )}

              {/* ACTIONS */}
              <div className="flex gap-6 mt-3">
                <button
                  onClick={() => handleLike(post._id)}
                  className="flex items-center gap-1 text-red-500"
                >
                  ❤️ {post.likes?.length || 0}
                </button>

                <button
                  onClick={() => setActivePost(post)}
                  className="flex items-center gap-1 text-blue-500 hover:underline"
                >
                  💬 {post.comments?.length || 0}
                </button>
              </div>
            </div>
          ))
        )}
      </div>

      {/* COMMENTS MODAL */}
      {activePost && (
        <CommentsModal
  post={activePost}
  setPosts={setPosts}
  setActivePost={setActivePost}   // ✅ add this
  onClose={() => setActivePost(null)}
/>
      )}
    </>
  );
}
