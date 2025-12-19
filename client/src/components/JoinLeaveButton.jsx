// src/components/JoinLeaveButton.jsx
import axiosInstance from "../utils/axiosInstance";

export default function JoinLeaveButton({ communityId, members, setCommunity }) {
  const userId = JSON.parse(localStorage.getItem("user"))?._id;

  const isMember = members.includes(userId);

const handleJoin = async () => {
  const res = await axiosInstance.post(
    `/communities/${communityId}/join`
  );
  setCommunity(res.data);
};

const handleLeave = async () => {
  const res = await axiosInstance.post(
    `/communities/${communityId}/leave`
  );
  setCommunity(res.data);
};

  return (
    <button
      onClick={isMember ? handleLeave : handleJoin}
      className={`px-6 py-2 rounded-lg font-semibold ${
        isMember
          ? "bg-red-100 text-red-600"
          : "bg-indigo-600 text-white"
      }`}
    >
      {isMember ? "Leave Community" : "Join Community"}
    </button>
  );
}
