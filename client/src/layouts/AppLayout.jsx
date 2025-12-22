import { Outlet, useNavigate } from "react-router-dom";
import { useContext, useEffect, useState } from "react";
import axiosInstance from "../utils/axiosInstance";
import { AuthContext } from "../context/AuthContext";

export default function AppLayout() {
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();
  const [myCommunities, setMyCommunities] = useState([]);

  useEffect(() => {
    const loadMyCommunities = async () => {
      try {
        const res = await axiosInstance.get("/communities/my");
        setMyCommunities(res.data);
      } catch (err) {
        console.error("Sidebar communities error", err);
      }
    };
    loadMyCommunities();
  }, []);

  return (
    <div className="flex min-h-screen bg-[#eef2ff]">
      
      {/* SIDEBAR */}
      <aside className="hidden w-64 p-6 bg-white shadow-xl md:block">
        <h2
          className="mb-6 text-2xl font-bold text-indigo-600 cursor-pointer"
          onClick={() => navigate("/dashboard")}
        >
          CampusConnect
        </h2>

        <ul className="mb-8 space-y-3">
          <li
            className="cursor-pointer hover:text-indigo-500"
            onClick={() => navigate("/dashboard")}
          >
            Dashboard
          </li>
          <li
            className="cursor-pointer hover:text-indigo-500"
            onClick={() => navigate("/profile")}
          >
            My Profile
          </li>
          <li
            className="cursor-pointer hover:text-indigo-500"
            onClick={() => navigate("/search")}
          >
            Search
          </li>
        </ul>

        <div>
          <h3 className="mb-3 text-sm font-semibold uppercase text-slate-500">
            My Communities
          </h3>

          {myCommunities.length === 0 ? (
            <p className="text-sm text-slate-400">
              You haven’t joined any yet
            </p>
          ) : (
            <ul className="space-y-2">
              {myCommunities.map((c) => (
                <li
                  key={c._id}
                  onClick={() => navigate(`/communities/${c._id}`)}
                  className="px-3 py-2 text-sm rounded-lg cursor-pointer hover:bg-indigo-50 hover:text-indigo-600"
                >
                  #{c.name}
                </li>
              ))}
            </ul>
          )}
        </div>
      </aside>

      {/* MAIN CONTENT */}
      <main className="flex-1 p-8">
        <Outlet />
      </main>
    </div>
  );
}
