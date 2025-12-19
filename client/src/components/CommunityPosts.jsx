// src/components/CommunityPosts.jsx
export default function CommunityPosts({ posts }) {
  return (
    <div className="space-y-4">
      <h2 className="text-2xl font-bold">Posts</h2>

      {posts.length === 0 ? (
        <p className="text-slate-500">No posts yet.</p>
      ) : (
        posts.map(post => (
          <div
            key={post._id}
            className="bg-white p-4 rounded-xl shadow"
          >
            <p className="font-semibold">{post.user.name}</p>
            <p className="mt-2">{post.content}</p>
            <p className="text-sm text-slate-400 mt-2">
              {new Date(post.createdAt).toLocaleString()}
            </p>
          </div>
        ))
      )}
    </div>
  );
}
