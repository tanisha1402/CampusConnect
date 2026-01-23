import { useNavigate, useLocation } from "react-router-dom";
import { useContext } from "react";
import { AuthContext } from "../context/AuthContext";

export default function TopNavbar() {
  const navigate = useNavigate();
  const location = useLocation();
  const { user } = useContext(AuthContext);

  const navItems = [
    { label: "🏠", path: "/dashboard" },
    { label: "👥", path: "/following" },
    { label: "📚", path: "/resources" },
    { label: "📅", path: "/events" },
    { label: "🌐", path: "/communities-feed" },
  ];

  return (
    <div className="sticky top-0 z-50 bg-white shadow-md">
      <div className="flex items-center justify-between px-6 py-3 max-w-7xl mx-auto">

        {/* Logo */}
        <h2
          className="text-2xl font-bold cursor-pointer text-primary"
          onClick={() => navigate("/dashboard")}
        >
          CampusConnect
        </h2>

        {/* Center icons */}
        <div className="flex gap-8 text-2xl">
          {navItems.map((item) => (
            <button
              key={item.path}
              onClick={() => navigate(item.path)}
              className={`transition ${
                location.pathname === item.path
                  ? "text-primary"
                  : "text-slate-400 hover:text-primary"
              }`}
            >
              {item.label}
            </button>
          ))}
        </div>

        {/* Right user */}
        <div
          className="flex items-center gap-3 cursor-pointer"
          onClick={() => navigate("/profile")}
        >
          {user?.profilePic ? (
            <img
              src={`http://localhost:5000${user.profilePic}`}
              alt="avatar"
              className="object-cover w-10 h-10 rounded-full shadow"
            />
          ) : (
            <div className="flex items-center justify-center w-10 h-10 font-semibold text-white bg-indigo-400 rounded-full">
              {user?.name?.charAt(0)?.toUpperCase() || "U"}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
