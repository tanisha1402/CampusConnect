import { useState, useEffect, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { useParams } from "react-router-dom";
import axiosInstance from "../utils/axiosInstance";
import { AuthContext } from "../context/AuthContext";
import FollowButton from "../components/FollowButton";


export default function PublicProfile() {
  const { id } = useParams();

  const { user: currentUser, setUser: setAuthUser } = useContext(AuthContext);

  const navigate = useNavigate();

  const [user, setUser] = useState(null);
  const [posts, setPosts] = useState([]);

  const [loading, setLoading] = useState(true);
  
  const refreshProfileUser = async () => {
  const res = await axiosInstance.get(`/users/${id}`);
  setUser(res.data);
};

  useEffect(() => {
    const loadData = async () => {
      try {
        const userRes = await axiosInstance.get(`/users/${id}`);
        setUser(userRes.data);

        const postRes = await axiosInstance.get(`/posts/user/${id}`);
        setPosts(postRes.data);

        setLoading(false);
      } catch (err) {
        console.error("Error loading user profile", err);
      }
    };

    loadData();
  }, [id]);

  if (loading) return <p className="p-10">Loading profile…</p>;

  if (!user) return <p className="p-10 text-red-500">User not found.</p>;
const isFollowing = user.followers?.some(
  (f) => (f._id || f).toString() === currentUser._id
);



  return (
    <div className="p-10">
      <div className="flex items-center justify-between mb-6">
  <div>
    <h1 className="text-3xl font-bold">{user.name}</h1>
    <p className="text-slate-700">{user.role}</p>
    <p className="text-slate-600">{user.bio}</p>
    <p className="text-slate-600">{user.department}</p>
  </div>

  {/* FOLLOW BUTTON */}
  {currentUser?._id !== user._id && (
  <FollowButton
  userId={user._id}
  isFollowing={isFollowing}
  setAuthUser={setAuthUser}
  onFollowSuccess={refreshProfileUser}
/>
  )}
</div>
<p className="mb-6 text-sm text-slate-500">
  👥 {user.followers?.length || 0} followers ·{" "}
  {user.following?.length || 0} following
</p>

{currentUser?._id !== user._id && (
  <button
    onClick={async () => {
      const res = await axiosInstance.post("/messages/start", {
        userId: user._id,
      });
      navigate(`/messages/${res.data._id}`);
    }}
    className="px-4 py-2 ml-3 text-white bg-indigo-500 rounded-lg hover:bg-indigo-600"
  >
    Message
  </button>
)}

   <h2 className="mt-8 mb-4 text-2xl font-bold">
  Posts by {user.name}
</h2>

{posts.length === 0 ? (
  <p className="text-slate-500">No posts yet.</p>
) : (
  <div className="space-y-4">
    {posts.map((post) => (
      <div key={post._id} className="p-4 bg-white border shadow rounded-xl">

        {/* USER HEADER */}
        <div className="flex items-center gap-3 mb-2">
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
            <p className="font-semibold text-indigo-600">
              {post.user?.name || "Unknown User"}
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

      </div>
    ))}
   </div>
)}
    </div>
  );
}
