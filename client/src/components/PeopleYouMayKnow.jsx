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

      <div className="space-y-4">
        {users.map(user => (
          <div key={user._id} className="flex items-center justify-between">
            <div
              className="cursor-pointer"
              onClick={() => navigate(`/profile/${user._id}`)}
            >
              <p className="font-medium text-indigo-600 hover:underline">
                {user.name}
              </p>
              <p className="text-xs capitalize text-slate-500">
                {user.role}
              </p>
            </div>

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
