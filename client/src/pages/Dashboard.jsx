import { useEffect, useState, useContext } from "react";
import axiosInstance from "../utils/axiosInstance";
import { AuthContext } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import DeleteConfirmModal from "../components/DeleteConfirmModal";
import PostOptionsMenu from "../components/PostOptionsMenu";

export default function Dashboard() {
  const { user, setUser } = useContext(AuthContext);
  const navigate = useNavigate();
  
  const [posts, setPosts] = useState([]);
  const [newPost, setNewPost] = useState("");
  const [loading, setLoading] = useState(true);
  const [editingPostId, setEditingPostId] = useState(null);
  const [editText, setEditText] = useState("");
  const [deletePostId, setDeletePostId] = useState(null);
  const [deleting, setDeleting] = useState(false);

  const [file, setFile] = useState(null);

  // Comments modal
  const [showModal, setShowModal] = useState(false);
  const [activePost, setActivePost] = useState(null);
  const [commentText, setCommentText] = useState("");

  // Load posts
  const loadPosts = async () => {
    try {
      const res = await axiosInstance.get("/posts");
      setPosts(res.data);
      setLoading(false);
    } catch (err) {
      console.error("Error loading posts", err);
    }
  };

  useEffect(() => {
    loadPosts();
  }, []);

  // Create post
const handleCreatePost = async (e) => {
  e.preventDefault();
  if (!newPost.trim() && !file) return;

  try {
    const formData = new FormData();
    formData.append("content", newPost);
    if (file) formData.append("file", file);

    const res = await axiosInstance.post("/posts", formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });

    setPosts((prev) => [res.data, ...prev]);
    setNewPost("");
    setFile(null);
  } catch (err) {
    console.error("Error creating post", err);
  }
};


  // Like post
  const handleLike = async (postId) => {
    try {
      const res = await axiosInstance.post(`/posts/${postId}/like`);
      setPosts((prev) =>
        prev.map((p) => (p._id === postId ? res.data : p))
      );
    } catch (err) {
      console.error("Error liking post", err);
    }
  };

  // Open comments
  const openComments = (post) => {
    setActivePost(post);
    setShowModal(true);
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

  // Add comment
  const handleAddComment = async () => {
    if (!commentText.trim()) return;

    try {
      const res = await axiosInstance.post(
        `/posts/${activePost._id}/comments`,
        { text: commentText }
      );

      setActivePost(res.data);
      setPosts((prev) =>
        prev.map((p) => (p._id === activePost._id ? res.data : p))
      );
      setCommentText("");
    } catch (err) {
      console.error("Error adding comment", err);
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
    console.error("Delete error", err);
    alert("Failed to delete post");
  } finally {
    setDeleting(false);
  }
};

const userId = user?._id;

const isSaved = (post) => {
  if (!post.savedBy || !userId) return false;

  return post.savedBy.some(
    (u) => u._id?.toString() === userId || u.toString() === userId
  );
};

const isFollowingUser = (targetUserId) => {
  if (!user?.following) return false;
  return user.following.some(
    (id) => id.toString() === targetUserId
  );
};

const toggleFollowUser = async (targetUserId) => {
  try {
    await axiosInstance.post(
  `/users/${targetUserId}/follow`
);

// 🔥 always trust backend, never guess
const me = await axiosInstance.get("/users/me");

setUser(me.data);
localStorage.setItem("user", JSON.stringify(me.data));

  } catch (err) {
    console.error("Follow toggle error", err);
  }
};


const savePost = async (postId) => {
  try {
    const res = await axiosInstance.post(`/posts/${postId}/save`);
    setPosts(prev =>
  prev.map(p => (p._id === postId ? res.data : p))
);

  } catch (err) {
    console.error("Save post error", err);
  }
};


  return (
    <>
      {/* Header */}
      <div className="sticky top-0 z-20 flex items-center justify-between px-4 py-4 mb-10 bg-white shadow-md rounded-2xl">
          <h1 className="text-2xl font-bold text-slate-800">
            Welcome, {user?.name}
          </h1>
        
          <div className="flex items-center justify-center w-12 h-12 font-bold text-white bg-indigo-300 rounded-full shadow-md">
            {user?.name?.charAt(0).toUpperCase()}
          </div>
        </div>


      {/* Communities actions */}
      <div className="p-6 mb-8 bg-white border shadow-xl rounded-3xl border-indigo-200/50">
        <h2 className="mb-4 text-xl font-bold text-indigo-600">Communities</h2>

        <button
          onClick={() => navigate("/communities/create")}
          className="px-4 py-2 text-white transition bg-indigo-500 rounded-xl hover:bg-indigo-600"
        >
          Create Community
        </button>
      </div>

      {/* Create post */}
      <div className="p-6 mb-8 bg-white border shadow-xl rounded-3xl border-indigo-200/50">
        <h2 className="mb-4 text-xl font-semibold">Create a Post</h2>

      <form onSubmit={handleCreatePost}>
  <textarea
    className="w-full p-4 border rounded-xl"
    placeholder="Share something..."
    value={newPost}
    onChange={(e) => setNewPost(e.target.value)}
  />

  <input
    type="file"
    accept="image/*,.pdf"
    onChange={(e) => setFile(e.target.files[0])}
    className="mt-3"
  />

  {file && (
    <p className="mt-1 text-sm text-slate-500">
      Selected: {file.name}
    </p>
  )}

  <button
    type="submit"
    className="px-6 py-3 mt-3 text-white bg-indigo-500 rounded-xl hover:bg-indigo-600"
  >
    Post
  </button>
</form>
      </div>

      {/* Posts feed */}
      <div className="space-y-5">
        {loading ? (
          <p>Loading posts...</p>
        ) : posts.length === 0 ? (
          <p className="text-slate-500">No posts yet.</p>
        ) : (
          posts.map((post) => (
            <div
              key={post._id}
              className="p-5 bg-white border shadow-md rounded-2xl"
            >
             {/* POST HEADER + MENU */}
<div className="flex items-start justify-between mb-3">
  <div className="flex items-center gap-3">
    <div className="flex items-center justify-center w-10 h-10 font-semibold text-white bg-indigo-400 rounded-full">
      {post.user?.name?.charAt(0)?.toUpperCase() || "U"}
    </div>

    <div>
      <p
        className="font-semibold text-indigo-600 cursor-pointer hover:underline"
        onClick={() => navigate(`/profile/${post.user._id}`)}
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
  >📎 {post.file.name}
  </a>
)}

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
          ))
        )}
      </div>

      {/* Comments Modal */}
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

    </>
  );
}

