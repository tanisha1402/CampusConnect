import { useEffect, useState, useContext } from "react";
import axiosInstance from "../utils/axiosInstance";
import { AuthContext } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";

export default function Dashboard() {
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();

  const [posts, setPosts] = useState([]);
  const [newPost, setNewPost] = useState("");
  const [loading, setLoading] = useState(true);

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
    if (!newPost.trim()) return;

    try {
      const res = await axiosInstance.post("/posts", { content: newPost });
      setPosts((prev) => [res.data, ...prev]);
      setNewPost("");
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
              <div className="flex items-center gap-3 mb-3">
                <div className="flex items-center justify-center w-10 h-10 font-semibold text-white bg-indigo-400 rounded-full">
                  {post.user.name.charAt(0).toUpperCase()}
                </div>

                <div>
                  <p
                    className="font-semibold text-indigo-600 cursor-pointer hover:underline"
                    onClick={() => navigate(`/profile/${post.user._id}`)}
                  >
                    {post.user.name}
                  </p>
                  <p className="text-xs text-slate-500">
                    {new Date(post.createdAt).toLocaleString()}
                  </p>
                </div>
              </div>

              <p className="mb-4 text-slate-700">{post.content}</p>

              <div className="flex items-center gap-6">
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
                  <p className="font-medium">{c.user.name}</p>
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
    </>
  );
}
