// src/components/JoinLeaveButton.jsx
import axiosInstance from "../utils/axiosInstance";

export default function JoinLeaveButton({ communityId, members, setCommunity }) {
  const userId = JSON.parse(localStorage.getItem("user"))?._id;

  const isMember = members.some(
    (m) => m._id === userId || m === userId
  );

  const handleJoin = async () => {
    const res = await axiosInstance.post(
      `/communities/${communityId}/join`
    );

    // ✅ res.data is now the updated community
    setCommunity(res.data);
  };

  const handleLeave = async () => {
    const res = await axiosInstance.post(
      `/communities/${communityId}/leave`
    );

    // ✅ res.data is now the updated community
    setCommunity(res.data);
  };

  return (
    <button
      onClick={isMember ? handleLeave : handleJoin}
      className={`px-6 py-2 rounded-lg font-semibold transition ${
        isMember
          ? "bg-red-100 text-red-600 hover:bg-red-200"
          : "bg-indigo-600 text-white hover:bg-indigo-700"
      }`}
    >
      {isMember ? "Leave Community" : "Join Community"}
    </button>
  );
}
