import { useState } from "react";
import axiosInstance from "../utils/axiosInstance";
import CommentsModal from "./CommentsModal";

export default function CommunityPosts({ posts, setPosts }) {
  const [activePost, setActivePost] = useState(null);

  const handleLike = async (postId) => {
    const res = await axiosInstance.post(`/posts/${postId}/like`);
    setPosts(prev =>
      prev.map(p => (p._id === postId ? res.data : p))
    );
  };

  return (
    <>
      <div className="space-y-4">
        <h2 className="text-2xl font-bold">Posts</h2>

        {posts.length === 0 ? (
          <p className="text-slate-500">No posts yet.</p>
        ) : (
          posts.map(post => (
            <div key={post._id} className="p-4 bg-white shadow rounded-xl">
              <p className="font-semibold">{post.user.name}</p>
              <p className="mt-2">{post.content}</p>

              {/* Actions */}
              <div className="flex gap-6 mt-3">
                
                {/* Like */}
                <button
                  onClick={() => handleLike(post._id)}
                  className="flex items-center gap-1 text-red-500"
                >
                  ❤️ {post.likes?.length || 0}
                </button>

                {/* Comments */}
                <button
                  onClick={() => setActivePost(post)}
                  className="flex items-center gap-1 text-blue-500 hover:underline"
                >
                  💬
                  <span className="text-slate-700">
                    {post.comments?.length || 0}
                  </span>
                </button>

              </div>
            </div>
          ))
        )}
      </div>

      {/* Modal */}
      {activePost && (
        <CommentsModal
          post={activePost}
          setPosts={setPosts}
          onClose={() => setActivePost(null)}
        />
      )}
    </>
  );
}
