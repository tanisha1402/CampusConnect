import { useState, useEffect, useContext } from "react";
import { useNavigate, useParams } from "react-router-dom";
import axiosInstance from "../utils/axiosInstance";
import { AuthContext } from "../context/AuthContext";
import FollowButton from "../components/FollowButton";
import PostOptionsMenu from "../components/PostOptionsMenu";
import DeleteConfirmModal from "../components/DeleteConfirmModal";

export default function PublicProfile() {
  const { id } = useParams();
  const { user: currentUser, setUser: setAuthUser } =
    useContext(AuthContext);

  const navigate = useNavigate();

  const [user, setUser] = useState(null);
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);

  // 🔥 comments modal
  const [activePost, setActivePost] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [commentText, setCommentText] = useState("");

  // 🔥 delete modal
  const [deletePostId, setDeletePostId] = useState(null);
  const [deleting, setDeleting] = useState(false);

  const refreshProfileUser = async () => {
    const res = await axiosInstance.get(`/users/${id}`);
    setUser(res.data);
  };

  useEffect(() => {
    const loadData = async () => {
      try {
        const userRes = await axiosInstance.get(`/users/${id}`);
        setUser(userRes.data);

        const postRes = await axiosInstance.get(
          `/posts/user/${id}`
        );
        setPosts(postRes.data);

        setLoading(false);
      } catch (err) {
        console.error("Error loading user profile", err);
      }
    };

    loadData();
  }, [id]);

  if (loading) return <p className="p-10">Loading profile…</p>;
  if (!user)
    return (
      <p className="p-10 text-red-500">
        User not found.
      </p>
    );

  const userId = currentUser?._id;

  const isFollowing = user.followers?.some(
    (f) => (f._id || f).toString() === currentUser._id
  );

  const isSaved = (post) => {
    if (!post.savedBy || !userId) return false;
    return post.savedBy.some(
      (u) => u._id?.toString() === userId || u.toString() === userId
    );
  };

  const handleLike = async (postId) => {
    try {
      const res = await axiosInstance.post(
        `/posts/${postId}/like`
      );

      setPosts((prev) =>
        prev.map((p) =>
          p._id === postId ? { ...res.data, user: p.user } : p
        )
      );

      if (activePost?._id === postId) {
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

      setActivePost({ ...res.data, user: activePost.user });

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

  const savePost = async (postId) => {
    try {
      const res = await axiosInstance.post(
        `/posts/${postId}/save`
      );

      setPosts((prev) =>
        prev.map((p) =>
          p._id === postId ? { ...res.data, user: p.user } : p
        )
      );
    } catch (err) {
      console.error("Save post error", err);
    }
  };

  const handleDelete = async () => {
    if (!deletePostId) return;

    try {
      setDeleting(true);
      await axiosInstance.delete(`/posts/${deletePostId}`);
      setPosts((prev) =>
        prev.filter((p) => p._id !== deletePostId)
      );
      setDeletePostId(null);
    } catch (err) {
      console.error("Delete error", err);
    } finally {
      setDeleting(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50">
      <div className="max-w-5xl p-8 mx-auto">

        {/* PROFILE HEADER */}
        <div className="flex flex-col gap-6 p-6 mb-8 bg-white shadow md:flex-row rounded-2xl">

          {/* AVATAR */}
          <div className="flex-shrink-0">
            {user.profilePic ? (
              <img
                src={`http://localhost:5000${user.profilePic}`}
                alt="avatar"
                className="object-cover w-28 h-28 rounded-full border shadow"
              />
            ) : (
              <div className="flex items-center justify-center w-28 h-28 text-4xl font-bold text-white bg-indigo-500 rounded-full shadow">
                {user.name?.charAt(0)?.toUpperCase() || "U"}
              </div>
            )}
          </div>

          {/* USER INFO */}
          <div className="flex-1">
            <div className="flex flex-col justify-between gap-4 md:flex-row md:items-start">

              <div>
                <h1 className="text-3xl font-bold text-slate-800">
                  {user.name}
                </h1>

                <p className="mt-1 text-sm text-indigo-600">
                  {user.role}
                  {user.department &&
                    ` · ${user.department}`}
                </p>

                {user.bio && (
                  <p className="mt-3 text-slate-700">
                    {user.bio}
                  </p>
                )}

                <p className="mt-4 text-sm text-slate-500">
                  👥 {user.followers?.length || 0} followers ·{" "}
                  {user.following?.length || 0} following
                </p>
              </div>

              {/* ACTION BUTTONS */}
              {currentUser?._id !== user._id && (
                <div className="flex items-center gap-3">
                  <FollowButton
                    userId={user._id}
                    isFollowing={isFollowing}
                    setAuthUser={setAuthUser}
                    onFollowSuccess={refreshProfileUser}
                  />

                  <button
                    onClick={async () => {
                      const res =
                        await axiosInstance.post(
                          "/messages/start",
                          { userId: user._id }
                        );
                      navigate(
                        `/messages/${res.data._id}`
                      );
                    }}
                    className="px-4 py-2 text-white bg-indigo-500 rounded-lg hover:bg-indigo-600"
                  >
                    Message
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* POSTS */}
        <h2 className="mb-4 text-2xl font-bold text-slate-800">
          Posts by {user.name}
        </h2>

        {posts.length === 0 ? (
          <p className="text-slate-500">
            No posts yet.
          </p>
        ) : (
          <div className="space-y-5">
            {posts.map((post) => (
              <div
                key={post._id}
                className="p-5 bg-white border shadow rounded-2xl"
              >
                {/* HEADER + 3 DOT MENU */}
                <div className="flex items-start justify-between mb-2">
                  <div className="flex items-center gap-3">
                    {post.user?.profilePic ? (
                      <img
                        src={`http://localhost:5000${post.user.profilePic}`}
                        alt="avatar"
                        className="object-cover w-10 h-10 rounded-full shadow"
                      />
                    ) : (
                      <div className="flex items-center justify-center w-10 h-10 font-semibold text-white bg-indigo-400 rounded-full">
                        {post.user?.name
                          ?.charAt(0)
                          ?.toUpperCase() || "U"}
                      </div>
                    )}

                    <div>
                      <p className="font-semibold text-indigo-600">
                        {post.user?.name ||
                          "Unknown User"}
                      </p>
                      <p className="text-xs text-slate-500">
                        {new Date(
                          post.createdAt
                        ).toLocaleString()}
                      </p>
                    </div>
                  </div>

                  {/* 3 DOT MENU */}
                  <PostOptionsMenu
                    post={post}
                    currentUserId={userId}
                    isSaved={isSaved(post)}
                    isFollowing={isFollowing}
                    onSaveToggle={() =>
                      savePost(post._id)
                    }
                    onDelete={() =>
                      setDeletePostId(post._id)
                    }
                  />
                </div>

                {/* CONTENT */}
                <p className="mt-2 whitespace-pre-wrap break-words leading-relaxed text-slate-800">
                  {post.content}
                </p>

                {/* FILE PREVIEW */}
                {post.file?.type === "image" && (
                  <img
                    src={`http://localhost:5000${post.file.url}`}
                    alt="upload"
                    className="w-full object-cover mt-3 border rounded-xl"
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
                    onClick={() =>
                      handleLike(post._id)
                    }
                    className="flex items-center gap-1 text-red-500"
                  >
                    ❤️ {post.likes?.length || 0}
                  </button>

                  <button
                    onClick={() =>
                      openComments(post)
                    }
                    className="flex items-center gap-1 text-blue-500"
                  >
                    💬 {post.comments?.length || 0}
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* COMMENTS MODAL */}
      {showModal && activePost && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
          <div className="p-6 bg-white rounded-2xl w-[450px]">
            <h2 className="mb-3 text-xl font-bold">
              Comments
            </h2>

            <div className="mb-4 space-y-3 overflow-y-auto max-h-60">
              {activePost.comments?.map((c, i) => (
                <div
                  key={i}
                  className="p-3 bg-slate-100 rounded-xl"
                >
                  <p
                    className="font-medium text-indigo-600 cursor-pointer hover:underline"
                    onClick={() =>
                      navigate(`/profile/${c.user._id}`)
                    }
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
              onChange={(e) =>
                setCommentText(e.target.value)
              }
            />

            <div className="flex justify-between mt-4">
              <button
                onClick={() => {
                  setShowModal(false);
                  setActivePost(null);
                  setCommentText("");
                }}
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
          message="Are you sure you want to delete this post?"
          onCancel={() => setDeletePostId(null)}
          onConfirm={handleDelete}
          loading={deleting}
        />
      )}
    </div>
  );
}
