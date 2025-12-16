import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import axiosInstance from "../utils/axiosInstance";

export default function PublicProfile() {
  const { id } = useParams();

  const [user, setUser] = useState(null);
  const [posts, setPosts] = useState([]);

  const [loading, setLoading] = useState(true);

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

  return (
    <div className="p-10">
      <h1 className="mb-4 text-3xl font-bold">{user.name}</h1>
      <p className="text-slate-700">{user.role}</p>
      <p className="text-slate-600">{user.bio}</p>
      <p className="text-slate-600">{user.department}</p>

      <h2 className="mt-8 mb-4 text-2xl font-bold">Posts by {user.name}</h2>

      {posts.length === 0 ? (
        <p className="text-slate-500">No posts yet.</p>
      ) : (
        <div className="space-y-4">
          {posts.map((post) => (
            <div key={post._id} className="p-4 bg-white border shadow rounded-xl">
              <p>{post.content}</p>
              <p className="text-sm text-slate-500">
                {new Date(post.createdAt).toLocaleString()}
              </p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
