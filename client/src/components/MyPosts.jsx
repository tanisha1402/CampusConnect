export default function MyPosts({ posts }) {
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
              <p className="text-slate-800">{post.content}</p>

              {/* 🔥 FILE PREVIEW (MISSING BEFORE) */}
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

              <p className="mt-2 text-xs text-slate-400">
                {new Date(post.createdAt).toLocaleString()}
              </p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
