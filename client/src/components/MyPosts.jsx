import { useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import axiosInstance from "../utils/axiosInstance";
import { AuthContext } from "../context/AuthContext";
import PostOptionsMenu from "../components/PostOptionsMenu";
import DeleteConfirmModal from "../components/DeleteConfirmModal";

export default function MyPosts({ posts, setPosts }) {
  const navigate = useNavigate();
  const { user, setUser } = useContext(AuthContext);

  const [activePost, setActivePost] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [commentText, setCommentText] = useState("");

  const [editingPostId, setEditingPostId] = useState(null);
  const [editText, setEditText] = useState("");

  const [deletePostId, setDeletePostId] = useState(null);
  const [deleting, setDeleting] = useState(false);

  const userId = user?._id;

  const isSaved = (post) => {
    if (!post.savedBy || !userId) return false;
    return post.savedBy.some(
      (u) => u._id?.toString() === userId || u.toString() === userId
    );
  };

  const isFollowingUser = (targetUserId) => {
    if (!user?.following) return false;
    return user.following.some((id) => id.toString() === targetUserId);
  };

  const toggleFollowUser = async (targetUserId) => {
    try {
      await axiosInstance.post(`/users/${targetUserId}/follow`);

      const me = await axiosInstance.get("/users/me");
      setUser(me.data);
      localStorage.setItem("user", JSON.stringify(me.data));
    } catch (err) {
      console.error("Follow toggle error", err);
    }
  };

 const handleLike = async (postId) => {
  try {
    const res = await axiosInstance.post(`/posts/${postId}/like`);

    setPosts((prev) =>
      prev.map((p) =>
        p._id === postId ? { ...res.data, user: p.user } : p
      )
    );

    // 🔥 keep modal post in sync too
    if (activePost && activePost._id === postId) {
      setActivePost({ ...res.data, user: activePost.user });
    }
  } catch (err) {
    console.error("Error liking post", err);
  }
};


  const openComments = (post) => {
    setActivePost(post);
    setShowModal(true);
  };

const handleAddComment = async () => {
  if (!commentText.trim()) return;

  try {
    const res = await axiosInstance.post(
      `/posts/${activePost._id}/comments`,
      { text: commentText }
    );

    // 🔥 update modal post
    setActivePost({ ...res.data, user: activePost.user });

    // 🔥 update posts list
    setPosts((prev) =>
      prev.map((p) =>
        p._id === activePost._id
          ? { ...res.data, user: p.user }
          : p
      )
    );

    setCommentText("");
  } catch (err) {
    console.error("Error adding comment", err);
  }
};


  const handleEdit = async (postId) => {
    if (!editText.trim()) return;

    try {
      const res = await axiosInstance.put(`/posts/${postId}`, {
        content: editText,
      });

      setPosts((prev) =>
        prev.map((p) =>
          p._id === postId ? { ...res.data, user: p.user } : p
        )
      );

      setEditingPostId(null);
      setEditText("");
    } catch (err) {
      console.error("Edit post error", err);
    }
  };

  const handleDelete = async () => {
    if (!deletePostId) return;

    try {
      setDeleting(true);
      await axiosInstance.delete(`/posts/${deletePostId}`);
      setPosts((prev) => prev.filter((p) => p._id !== deletePostId));
      setDeletePostId(null);
    } catch (err) {
      console.error("Delete error", err);
    } finally {
      setDeleting(false);
    }
  };

  const savePost = async (postId) => {
    try {
      const res = await axiosInstance.post(`/posts/${postId}/save`);
      setPosts((prev) =>
        prev.map((p) =>
          p._id === postId ? { ...res.data, user: p.user } : p
        )
      );
    } catch (err) {
      console.error("Save post error", err);
    }
  };

  return (
    <div className="p-6 bg-white shadow rounded-2xl">
      <h2 className="mb-4 text-xl font-semibold">My Posts</h2>

      {posts.length === 0 ? (
        <p className="text-slate-500">You haven’t posted anything yet.</p>
      ) : (
        <div className="space-y-4">
          {posts.map((post) => (
            <div
              key={post._id}
              className="p-4 transition border rounded-xl hover:bg-slate-50"
            >
              {/* HEADER + MENU */}
              <div className="flex items-start justify-between mb-2">
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
                      {post.user?.name || "Unknown User"}
                    </p>

                    <p className="text-xs text-slate-400">
                      {new Date(post.createdAt).toLocaleString()}
                      {post.editedAt && (
                        <span className="ml-1 italic text-slate-400">
                          (edited {new Date(post.editedAt).toLocaleString()})
                        </span>
                      )}
                    </p>
                  </div>
                </div>

                {/* 3 DOT MENU */}
                <PostOptionsMenu
                  post={post}
                  currentUserId={user?._id}
                  isSaved={isSaved(post)}
                  isFollowing={isFollowingUser(post.user._id)}
                  onSaveToggle={() => savePost(post._id)}
                  onEdit={() => {
                    setEditingPostId(post._id);
                    setEditText(post.content);
                  }}
                  onDelete={() => setDeletePostId(post._id)}
                  onFollowToggle={() => toggleFollowUser(post.user._id)}
                />
              </div>

              {/* CONTENT */}
              {editingPostId === post._id ? (
                <div className="mt-2 space-y-2">
                  <textarea
                    className="w-full p-2 border rounded-xl"
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
                <p className="text-slate-800">{post.content}</p>
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
                  onClick={() => openComments(post)}
                  className="flex items-center gap-1 text-blue-500"
                >
                  💬 {post.comments?.length || 0}
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* COMMENTS MODAL */}
      {showModal && activePost && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
          <div className="p-6 bg-white rounded-2xl w-[450px]">
            <h2 className="mb-3 text-xl font-bold">Comments</h2>

            <div className="mb-4 space-y-3 overflow-y-auto max-h-60">
              {activePost.comments?.map((c, i) => (
                <div key={i} className="p-3 bg-slate-100 rounded-xl">
                  <p
                    className="font-medium text-indigo-600 cursor-pointer hover:underline"
                    onClick={() => navigate(`/profile/${c.user._id}`)}
                  >
                    {c.user.name}
                  </p>
                  <p>{c.text}</p>
                </div>
              ))}
            </div>

            <textarea
              className="w-full p-3 border rounded-xl"
              placeholder="Write a comment..."
              value={commentText}
              onChange={(e) => setCommentText(e.target.value)}
            />

            <div className="flex justify-between mt-4">
              <button
                onClick={() => setShowModal(false)}
                className="px-4 py-2 bg-slate-300 rounded-xl"
              >
                Close
              </button>

              <button
                onClick={handleAddComment}
                className="px-4 py-2 text-white bg-indigo-500 rounded-xl"
              >
                Send
              </button>
            </div>
          </div>
        </div>
      )}

      {deletePostId && (
        <DeleteConfirmModal
          message="Are you sure you want to delete this post? This action cannot be undone."
          onCancel={() => setDeletePostId(null)}
          onConfirm={handleDelete}
          loading={deleting}
        />
      )}
    </div>
  );
}
