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
  <div className="min-h-screen bg-gradient-to-br from-primarySoft via-lavender to-primarySoft">
    
    <div className="flex min-h-screen">
      
      {/* SIDEBAR */}
      <aside className="hidden w-64 p-6 shadow-xl bg-white/80 backdrop-blur-xl md:block">
        <h2
          className="mb-6 text-2xl font-bold cursor-pointer text-primary"
          onClick={() => navigate("/dashboard")}
        >
          CampusConnect
        </h2>

        <ul className="mb-8 space-y-3 text-textMain">
          <li onClick={() => navigate("/dashboard")} className="cursor-pointer hover:text-primary">
            Dashboard
          </li>
          <li onClick={() => navigate("/profile")} className="cursor-pointer hover:text-primary">
            My Profile
          </li>
          <li onClick={() => navigate("/search")} className="cursor-pointer hover:text-primary">
            Search
          </li>
          <li onClick={() => navigate("/messages")} className="cursor-pointer hover:text-indigo-500">
            Messages
          </li>
          <li
        onClick={() => navigate("/saved")}
        className="cursor-pointer hover:text-primary"
          >
        🔖 Saved Posts
        </li>

        </ul>

        <div>
          <h3 className="mb-3 text-sm font-semibold uppercase text-textMuted">
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
                  className="px-3 py-2 text-sm rounded-lg cursor-pointer hover:bg-primarySoft hover:text-primary"
                >
                  #{c.name}
                </li>
              ))}
            </ul>
          )}
        </div>
      </aside>

      {/* MAIN CONTENT */}
      <main className="flex-1 px-6 py-10">
        <div className="max-w-6xl mx-auto">
          <Outlet />
        </div>
      </main>

    </div>
  </div>
);

}
