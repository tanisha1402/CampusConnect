import { useNavigate } from "react-router-dom";
import { useContext, useState } from "react";
import { AuthContext } from "../context/AuthContext";
import axiosInstance from "../utils/axiosInstance";
import PostOptionsMenu from "./PostOptionsMenu";

export default function MyPosts({ posts, setPosts }) {
  const navigate = useNavigate();
  const { user } = useContext(AuthContext);

  const [editingPostId, setEditingPostId] = useState(null);
  const [editText, setEditText] = useState("");

  const handleLike = async (postId) => {
    const res = await axiosInstance.post(`/posts/${postId}/like`);
    setPosts(prev =>
      prev.map(p =>
        p._id === postId ? { ...res.data, user: p.user } : p
      )
    );
  };

  const handleEdit = async (postId) => {
    if (!editText.trim()) return;
    const res = await axiosInstance.put(`/posts/${postId}`, {
      content: editText,
    });
    setPosts(prev =>
      prev.map(p =>
        p._id === postId ? { ...res.data, user: p.user } : p
      )
    );
    setEditingPostId(null);
    setEditText("");
  };

  const handleDelete = async (postId) => {
    await axiosInstance.delete(`/posts/${postId}`);
    setPosts(prev => prev.filter(p => p._id !== postId));
  };

  const isSaved = (post) =>
    post.savedBy?.some(u => u._id === user._id);

  return (
    <div className="p-6 bg-white shadow-xl rounded-3xl">
      <h2 className="mb-6 text-2xl font-bold">My Posts</h2>

      {posts.length === 0 ? (
        <div className="p-10 text-center rounded-xl bg-slate-50">
          <p className="text-lg text-slate-500">
            You haven’t posted anything yet.
          </p>
        </div>
      ) : (
        <div className="space-y-6">
          {posts.map((post) => (
            <div
              key={post._id}
              className="p-5 transition bg-white border shadow-sm rounded-2xl hover:shadow-md"
            >
              {/* HEADER */}
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-3">
                  {post.user?.profilePic ? (
                    <img
                      src={`http://localhost:5000${post.user.profilePic}`}
                      alt="avatar"
                      className="object-cover w-10 h-10 rounded-full shadow cursor-pointer"
                      onClick={() =>
                        navigate(`/profile/${post.user._id}`)
                      }
                    />
                  ) : (
                    <div
                      className="flex items-center justify-center w-10 h-10 font-semibold text-white bg-indigo-400 rounded-full cursor-pointer"
                      onClick={() =>
                        navigate(`/profile/${post.user._id}`)
                      }
                    >
                      {post.user?.name?.charAt(0).toUpperCase() || "U"}
                    </div>
                  )}

                  <div>
                    <p
                      className="font-semibold text-indigo-600 cursor-pointer hover:underline"
                      onClick={() =>
                        navigate(`/profile/${post.user._id}`)
                      }
                    >
                      {post.user?.name}
                    </p>
                    <p className="text-xs text-slate-400">
                      {new Date(post.createdAt).toLocaleString()}
                    </p>
                  </div>
                </div>

                <PostOptionsMenu
                  post={post}
                  currentUserId={user._id}
                  isSaved={isSaved(post)}
                  isFollowing={false}
                  onSaveToggle={() => {}}
                  onEdit={() => {
                    setEditingPostId(post._id);
                    setEditText(post.content);
                  }}
                  onDelete={() => handleDelete(post._id)}
                  onFollowToggle={() => {}}
                />
              </div>

              {/* CONTENT */}
              {editingPostId === post._id ? (
                <div className="mt-3 space-y-3">
                  <textarea
                    className="w-full p-3 border rounded-xl"
                    value={editText}
                    onChange={(e) => setEditText(e.target.value)}
                  />
                  <div className="flex gap-2">
                    <button
                      onClick={() => handleEdit(post._id)}
                      className="px-4 py-2 text-white bg-indigo-600 rounded-lg"
                    >
                      Save
                    </button>
                    <button
                      onClick={() => {
                        setEditingPostId(null);
                        setEditText("");
                      }}
                      className="px-4 py-2 bg-slate-300 rounded-lg"
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              ) : (
                <p className="mt-3 text-slate-800">
                  {post.content}
                </p>
              )}

              {/* FILE */}
              {post.file?.type === "image" && (
                <img
                  src={`http://localhost:5000${post.file.url}`}
                  alt="post upload"
                  className="object-cover w-full mt-4 border rounded-2xl max-h-96"
                />
              )}

              {post.file?.type === "file" && (
                <a
                  href={`http://localhost:5000${post.file.url}`}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-2 mt-4 text-indigo-600 hover:underline"
                >
                  📎 {post.file.name}
                </a>
              )}

              {/* ACTIONS */}
              <div className="flex gap-6 mt-4">
                <button
                  onClick={() => handleLike(post._id)}
                  className="flex items-center gap-1 text-red-500"
                >
                  ❤️ {post.likes?.length || 0}
                </button>

                <span className="text-sm text-slate-500">
                  💬 {post.comments?.length || 0}
                </span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
