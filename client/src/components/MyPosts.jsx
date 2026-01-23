import { useNavigate } from "react-router-dom";

export default function MyPosts({ posts }) {
  const navigate = useNavigate();

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
              {/* 🔥 USER HEADER (MISSING BEFORE) */}
              <div className="flex items-center gap-3 mb-2">
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
                  </p>
                </div>
              </div>

              {/* CONTENT */}
              <p className="text-slate-800">{post.content}</p>

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
