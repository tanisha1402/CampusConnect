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
            className="p-4 bg-white shadow rounded-xl space-y-2"
          >
            {/* USER HEADER */}
            <div
              className="flex items-center gap-3 cursor-pointer"
              onClick={() => navigate(`/profile/${post.user._id}`)}
            >
              {post.user.profilePic ? (
                <img
                  src={`http://localhost:5000${post.user.profilePic}`}
                  alt={post.user.name}
                  className="w-10 h-10 rounded-full object-cover shadow"
                />
              ) : (
                <div className="flex items-center justify-center w-10 h-10 text-sm font-bold text-white bg-indigo-400 rounded-full">
                  {post.user.name.charAt(0).toUpperCase()}
                </div>
              )}

              <p className="font-semibold text-indigo-600 hover:underline">
                {post.user.name}
              </p>
            </div>

            {/* POST CONTENT */}
            <p>{post.content}</p>

            <p className="text-xs text-slate-500">
              {new Date(post.createdAt).toLocaleString()}
            </p>
          </div>
        ))
      )}
    </div>
  );
}
