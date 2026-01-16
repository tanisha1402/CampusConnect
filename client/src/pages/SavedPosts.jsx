import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axiosInstance from "../utils/axiosInstance";

export default function SavedPosts() {
  const [posts, setPosts] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const loadSaved = async () => {
      const res = await axiosInstance.get("/posts/saved");
      setPosts(res.data);
    };
    loadSaved();
  }, []);

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-4">
      <h1 className="text-2xl font-bold">Saved Posts</h1>

      {posts.length === 0 ? (
        <p className="text-slate-500">No saved posts yet</p>
      ) : (
        posts.map((post) => (
          <div
            key={post._id}
            className="p-4 bg-white shadow rounded-xl"
          >
            <p
              className="font-semibold text-indigo-600 cursor-pointer hover:underline"
              onClick={() => navigate(`/profile/${post.user._id}`)}
            >
              {post.user.name}
            </p>

            <p className="mt-2">{post.content}</p>

            <p className="mt-2 text-xs text-slate-500">
              {new Date(post.createdAt).toLocaleString()}
            </p>
          </div>
        ))
      )}
    </div>
  );
}
