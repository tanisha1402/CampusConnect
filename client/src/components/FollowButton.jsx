import { useState } from "react";
import axiosInstance from "../utils/axiosInstance";

export default function FollowButton({ userId, initialFollowing }) {
  const [isFollowing, setIsFollowing] = useState(initialFollowing);
  const [loading, setLoading] = useState(false);

  const toggleFollow = async () => {
    try {
      setLoading(true);
      const res = await axiosInstance.post(`/users/${userId}/follow`);
      setIsFollowing(res.data.isFollowing);
    } catch (err) {
      console.error("Follow error", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <button
      onClick={toggleFollow}
      disabled={loading}
      className={`px-4 py-2 rounded-lg font-semibold transition ${
        isFollowing
          ? "bg-slate-200 text-slate-700 hover:bg-slate-300"
          : "bg-indigo-600 text-white hover:bg-indigo-700"
      }`}
    >
      {isFollowing ? "Following" : "Follow"}
    </button>
  );
}
