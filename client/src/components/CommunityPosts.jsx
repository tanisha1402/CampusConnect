import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axiosInstance from "../utils/axiosInstance";
import CommentsModal from "./CommentsModal";
import DeleteConfirmModal from "./DeleteConfirmModal";

export default function CommunityPosts({ posts, setPosts }) {
  const [activePost, setActivePost] = useState(null);
  const navigate = useNavigate();
  const userId = JSON.parse(localStorage.getItem("user"))?._id;
  const [editingPostId, setEditingPostId] = useState(null);
  const [editText, setEditText] = useState("");
  const [deletePostId, setDeletePostId] = useState(null);
  const [deleting, setDeleting] = useState(false);


  const handleLike = async (postId) => {
    const res = await axiosInstance.post(`/posts/${postId}/like`);
    setPosts((prev) =>
      prev.map((p) => (p._id === postId ? res.data : p))
    );
  };
 const handleEdit = async (postId) => {
  if (!editText.trim()) return;

  try {
    const res = await axiosInstance.put(`/posts/${postId}`, {
      content: editText,
    });

    setPosts((prev) =>
      prev.map((p) => (p._id === postId ? res.data : p))
    );

    setEditingPostId(null);
    setEditText("");
  } catch (err) {
    console.error("Edit post error", err);
    alert(err.response?.data?.message || "Failed to edit post");
  }
};
const handleDelete = async () => {
  if (!deletePostId) return;

  try {
    setDeleting(true);
    await axiosInstance.delete(`/posts/${deletePostId}`);
    setPosts(prev => prev.filter(p => p._id !== deletePostId));
    setDeletePostId(null);
  } catch (err) {
    console.error("Delete post error", err);
    alert(err.response?.data?.message || "Failed to delete post");
  } finally {
    setDeleting(false);
  }
};


const isSaved = (post) => {
  if (!post.savedBy || !userId) return false;

  return post.savedBy.some(
    (u) => u._id?.toString() === userId || u.toString() === userId
  );
};

const savePost = async (postId) => {
  try {
    const res = await axiosInstance.post(`/posts/${postId}/save`);

    setPosts(prev =>
      prev.map(p => {
        if (p._id !== postId) return p;

        const alreadySaved = isSaved(p);

        return {
          ...p,
          savedBy: alreadySaved
            ? p.savedBy.filter(
                (id) => id.toString() !== userId
              )
            : [...(p.savedBy || []), userId],
        };
      })
    );
  } catch (err) {
    console.error("Save post error", err);
  }
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
                    {post.user?.name || "Unknown User"}
                  </p>
                  <p className="text-xs text-slate-500">
  {new Date(post.createdAt).toLocaleString()}
  {post.editedAt && (
  <span className="ml-1 italic text-slate-400">
    (edited {new Date(post.editedAt).toLocaleString()})
  </span>
)}

</p>

                </div>
              </div>
{/* CONTENT */}
{editingPostId === post._id ? (
  <div className="mt-2 space-y-2">
    <textarea
      className="w-full p-2 border rounded-lg"
      value={editText}
      onChange={(e) => setEditText(e.target.value)}
    />
    <div className="flex gap-2">
      <button
        onClick={() => handleEdit(post._id)}
        className="px-3 py-1 text-white bg-indigo-500 rounded-lg"
      >
        Save
      </button>
      <button
        onClick={() => {
          setEditingPostId(null);
          setEditText("");
        }}
        className="px-3 py-1 rounded-lg bg-slate-300"
      >
        Cancel
      </button>
    </div>
  </div>
) : (
  <p className="mt-2">{post.content}</p>
)}


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
    {post.user._id === userId && (
  <>
    <button
      onClick={() => {
        setEditingPostId(post._id);
        setEditText(post.content);
      }}
      className="text-sm text-indigo-600 hover:underline"
    >
      ✏️ Edit
    </button>

    <button
  onClick={() => setDeletePostId(post._id)}
  className="text-sm text-red-600 hover:underline"
>
  🗑 Delete
</button>
  </>
)}

{/* EVERYONE */}
<button
  onClick={() => savePost(post._id)}
  className={`flex items-center gap-1 ${
    isSaved(post) ? "text-indigo-600" : "text-slate-500"
  }`}
>
  {isSaved(post) ? "🔖" : "📑"}
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
  setActivePost={setActivePost}  
  onClose={() => setActivePost(null)}
/>
      )}

      {deletePostId && (
  <DeleteConfirmModal
    message="Are you sure you want to delete this post? This action cannot be undone."
    onCancel={() => setDeletePostId(null)}
    onConfirm={handleDelete}
    loading={deleting}
  />
)}

    </>
  );
}
