import axiosInstance from "../utils/axiosInstance";

export default function FollowButton({ userId, isFollowing, setUser }) {

  const toggleFollow = async () => {
    try {
      const res = await axiosInstance.post(`/users/${userId}/follow`);

      // 🔥 THIS is the key line
      setUser(prev => ({
  ...prev,
  followers: res.data.followers,
  following: res.data.following
}));


    } catch (err) {
      console.error("Follow error", err);
    }
  };

  return (
    <button
      onClick={toggleFollow}
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
