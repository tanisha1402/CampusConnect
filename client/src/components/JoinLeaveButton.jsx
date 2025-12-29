// src/components/JoinLeaveButton.jsx
import axiosInstance from "../utils/axiosInstance";
export default function JoinLeaveButton({ communityId, members, setCommunity }) {
  const userId = JSON.parse(localStorage.getItem("user"))?._id;

  const isMember = members.some(
    (m) => m.user?._id === userId
  );

  const handleJoin = async () => {
    const res = await axiosInstance.post(
      `/communities/${communityId}/join`
    );
    setCommunity(res.data);
  };

const handleLeave = async () => {
  try {
    const res = await axiosInstance.post(
      `/communities/${communityId}/leave`
    );

    // 🚨 COMMUNITY WAS DELETED
    if (res.data?.deleted) {
      window.location.href = "/dashboard";
      return;
    }

    // ✅ NORMAL LEAVE
    setCommunity(res.data);
  } catch (err) {
    alert(err.response?.data?.message || "Error leaving community");
  }
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
