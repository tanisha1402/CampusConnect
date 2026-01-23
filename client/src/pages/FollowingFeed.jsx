import { useEffect, useState, useContext } from "react";
import axiosInstance from "../utils/axiosInstance";
import { AuthContext } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import PostOptionsMenu from "../components/PostOptionsMenu";

export default function FollowingFeed() {
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();

  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      const res = await axiosInstance.get("/posts");
      const followingIds = user?.following?.map((id) => id.toString()) || [];

      const filtered = res.data.filter((p) =>
        followingIds.includes(p.user._id)
      );

      setPosts(filtered);
      setLoading(false);
    };

    load();
  }, [user]);

  if (loading) return <p>Loading...</p>;

  return (
    <div className="space-y-5">
      {posts.map((post) => (
        <div key={post._id} className="p-5 bg-white border shadow-md rounded-2xl">
          <div className="flex justify-between">
            <p
              className="font-semibold text-indigo-600 cursor-pointer hover:underline"
              onClick={() => navigate(`/profile/${post.user._id}`)}
            >
              {post.user.name}
            </p>

            <PostOptionsMenu
              post={post}
              currentUserId={user?._id}
              isSaved={false}
              isFollowing={true}
              onSaveToggle={() => {}}
              onEdit={() => {}}
              onDelete={() => {}}
              onFollowToggle={() => {}}
            />
          </div>

          <p className="mt-2">{post.content}</p>
        </div>
      ))}
    </div>
  );
}
