import { useEffect, useState } from "react";
import axiosInstance from "../utils/axiosInstance";

export default function CommunitiesFeed() {
  const [posts, setPosts] = useState([]);

  useEffect(() => {
    const load = async () => {
      const res = await axiosInstance.get("/posts");
      const communityPosts = res.data.filter((p) => p.community);
      setPosts(communityPosts);
    };

    load();
  }, []);

  return (
    <div className="space-y-5">
      {posts.map((post) => (
        <div key={post._id} className="p-5 bg-white border shadow-md rounded-2xl">
          <p className="font-semibold text-indigo-600">
            {post.user?.name}
          </p>
          <p className="mt-2">{post.content}</p>
        </div>
      ))}
    </div>
  );
}
