import axiosInstance from "../utils/axiosInstance";

export default function FollowButton({
  userId,
  isFollowing,
  setAuthUser,
  onFollowSuccess,
}) {

  const toggleFollow = async () => {
    try {
      await axiosInstance.post(`/users/${userId}/follow`);

      const me = await axiosInstance.get("/users/me");
      setAuthUser(me.data);
      localStorage.setItem("user", JSON.stringify(me.data));

      // 🔥 notify parent (PublicProfile)
      onFollowSuccess?.();

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
