import { useEffect, useState, useContext } from "react";
import axiosInstance from "../utils/axiosInstance";
import { AuthContext } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";

export default function PeopleYouMayKnow() {
  const [users, setUsers] = useState([]);
  const { setUser } = useContext(AuthContext);
  const navigate = useNavigate();

  useEffect(() => {
    const loadSuggestions = async () => {
      const res = await axiosInstance.get("/users/suggestions");
      setUsers(res.data);
    };
    loadSuggestions();
  }, []);

  const followUser = async (userId) => {
    await axiosInstance.post(`/users/${userId}/follow`);
    const me = await axiosInstance.get("/users/me");
    setUser(me.data);
    setUsers(prev => prev.filter(u => u._id !== userId));
  };

  if (users.length === 0) return null;

  return (
    <div className="p-4 bg-white border shadow-md rounded-2xl">
      <h3 className="mb-4 text-lg font-semibold text-slate-700">
        People you may know
      </h3>

     <div className="space-y-4 max-h-[70vh] overflow-y-auto pr-1 people-scroll">
       {users.map(user => (
  <div
    key={user._id}
    className="flex items-center justify-between gap-3"
  >
    {/* LEFT: Avatar + Name */}
    <div
      className="flex items-center gap-3 cursor-pointer"
      onClick={() => navigate(`/profile/${user._id}`)}
    >
      {/* Avatar */}
      {user.profilePic ? (
        <img
          src={`http://localhost:5000${user.profilePic}`}
          alt="avatar"
          className="object-cover w-10 h-10 rounded-full shadow"
        />
      ) : (
        <div className="flex items-center justify-center w-10 h-10 text-sm font-bold text-white bg-indigo-300 rounded-full">
          {user.name?.charAt(0).toUpperCase()}
        </div>
      )}

      {/* Name + Role */}
      <div>
        <p className="font-medium text-indigo-600 hover:underline">
          {user.name}
        </p>
        <p className="text-xs capitalize text-slate-500">
          {user.role}
        </p>
      </div>
    </div>

    {/* RIGHT: Follow Button */}
    <button
      onClick={() => followUser(user._id)}
      className="px-3 py-1 text-sm text-white bg-indigo-500 rounded-lg hover:bg-indigo-600"
    >
      Follow
    </button>
  </div>
))}
      </div>
    </div>
  );
}
