import { useEffect, useState, useContext } from "react";
import axiosInstance from "../utils/axiosInstance";
import { AuthContext } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import PostOptionsMenu from "../components/PostOptionsMenu";
import CommentsModal from "../components/CommentsModal";

export default function FollowingFeed() {
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();
  const userId = user?._id;

  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);

  const [activePost, setActivePost] = useState(null);

  useEffect(() => {
    const load = async () => {
      try {
        const res = await axiosInstance.get("/posts");
        const followingIds = user?.following?.map((id) => id.toString()) || [];

        const filtered = res.data.filter((p) =>
          followingIds.includes(p.user._id.toString())
        );

        setPosts(filtered);
      } catch (err) {
        console.error("Following feed error", err);
      } finally {
        setLoading(false);
      }
    };

    if (user) load();
  }, [user]);

  const isSaved = (post) => {
    if (!post.savedBy || !userId) return false;
    return post.savedBy.some(
      (u) => u._id?.toString() === userId || u.toString() === userId
    );
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
      alert(err.response?.data?.message || "Failed to save post");
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
    } catch (err) {
      console.error("Like error", err);
      alert("Failed to like post");
    }
  };

  const handleDelete = async (postId) => {
    try {
      await axiosInstance.delete(`/posts/${postId}`);
      setPosts((prev) => prev.filter((p) => p._id !== postId));
    } catch (err) {
      console.error("Delete post error", err);
      alert("Failed to delete post");
    }
  };

  if (loading) return <p className="p-6">Loading...</p>;

  return (
    <div className="space-y-5">
      {posts.map((post) => (
        <div
          key={post._id}
          className="p-5 bg-white border shadow-md rounded-2xl"
        >
          {/* HEADER */}
          <div className="flex items-center justify-between">
            <div
              className="flex items-center gap-3 cursor-pointer"
              onClick={() => navigate(`/profile/${post.user._id}`)}
            >
              {post.user?.profilePic ? (
                <img
                  src={`http://localhost:5000${post.user.profilePic}`}
                  alt="avatar"
                  className="object-cover w-10 h-10 rounded-full shadow"
                />
              ) : (
                <div className="flex items-center justify-center w-10 h-10 font-semibold text-white bg-indigo-400 rounded-full">
                  {post.user?.name?.charAt(0)?.toUpperCase() || "U"}
                </div>
              )}

              <div>
                <p className="font-semibold text-indigo-600 hover:underline">
                  {post.user?.name || "Unknown User"}
                </p>
                <p className="text-xs text-slate-500">
                  {new Date(post.createdAt).toLocaleString()}
                </p>
              </div>
            </div>

            <PostOptionsMenu
              post={post}
              currentUserId={userId}
              isSaved={isSaved(post)}
              isFollowing={true}
              onSaveToggle={() => savePost(post._id)}
              onEdit={() => {}}
              onDelete={() => handleDelete(post._id)}
              onFollowToggle={() => {}}
            />
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
          <div className="flex items-center gap-6 mt-4 text-slate-600">
            <button
              onClick={() => handleLike(post._id)}
              className="hover:text-red-500"
            >
              ❤️ {post.likes?.length || 0}
            </button>

            <button
              onClick={() => setActivePost(post)}
              className="hover:text-blue-500"
            >
              💬 {post.comments?.length || 0}
            </button>
          </div>
        </div>
      ))}

      {/* COMMENTS MODAL */}
      {activePost && (
        <CommentsModal
          post={activePost}
          setPosts={setPosts}
          setActivePost={setActivePost}
          onClose={() => setActivePost(null)}
        />
      )}
    </div>
  );
}
