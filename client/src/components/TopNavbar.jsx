import { useNavigate, useLocation } from "react-router-dom";
import { useContext } from "react";
import { AuthContext } from "../context/AuthContext";
import NotificationBell from "./NotificationBell";

export default function TopNavbar() {
  const navigate = useNavigate();
  const location = useLocation();
  const { user, logout } = useContext(AuthContext);

  const navItems = [
    { label: "🏠", path: "/dashboard" },
    { label: "👥", path: "/following" },
    { label: "📚", path: "/resources" },
    { label: "📅", path: "/events" },
    { label: "🌐", path: "/communities-feed" },
  ];

  return (
    <div className="sticky top-0 z-50 bg-white shadow-md">
      {/* FULL WIDTH */}
      <div className="relative flex items-center h-16 px-6">

        {/* LEFT — aligned with sidebar */}
        <h2
          className="text-2xl font-bold cursor-pointer text-primary w-64"
          onClick={() => navigate("/dashboard")}
        >
          CampusConnect
        </h2>

        {/* CENTER — true screen center */}
        <div className="absolute left-1/2 -translate-x-1/2 flex gap-6 text-2xl">
          {navItems.map((item) => (
            <button
              key={item.path}
              onClick={() => navigate(item.path)}
              className={
                location.pathname === item.path
                  ? "text-primary"
                  : "text-slate-400 hover:text-primary"
              }
            >
              {item.label}
            </button>
          ))}
        </div>

        {/* RIGHT */}
       <div className="flex items-center gap-4 ml-auto">
  <NotificationBell />

  {/* PROFILE */}
  <div
    className="cursor-pointer"
    onClick={() => navigate("/profile")}
  >
    {user?.profilePic ? (
      <img
        src={`http://localhost:5000${user.profilePic}`}
        alt="avatar"
        className="object-cover w-9 h-9 rounded-full shadow"
      />
    ) : (
      <div className="flex items-center justify-center w-9 h-9 font-semibold text-white bg-indigo-400 rounded-full">
        {user?.name?.charAt(0)?.toUpperCase() || "U"}
      </div>
    )}
  </div>

  {/* LOGOUT */}
  <button
    onClick={() => {
  if (window.confirm("Log out of CampusConnect?")) {
    logout();
    navigate("/");
  }
}}
    className="px-3 py-1 text-sm text-white bg-red-500 rounded-lg hover:bg-red-600"
  >
    Logout
  </button>
</div>


      </div>
    </div>
  );
}
