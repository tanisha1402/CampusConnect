import { useEffect, useState, useRef } from "react";
import { Link } from "react-router-dom";
import axiosInstance from "../utils/axiosInstance";

export default function NotificationBell() {
  const [notifications, setNotifications] = useState([]);
  const [open, setOpen] = useState(false);
  const dropdownRef = useRef(null);

  const unreadCount = notifications.filter(n => !n.read).length;

  const loadNotifications = async () => {
    try {
      const res = await axiosInstance.get("/notifications");
      setNotifications(res.data);
    } catch (err) {
      console.error("Failed to load notifications", err);
    }
  };

  const markAsRead = async (id) => {
    try {
      await axiosInstance.put(`/notifications/${id}/read`);
      setNotifications(prev =>
        prev.map(n =>
          n._id === id ? { ...n, read: true } : n
        )
      );
    } catch (err) {
      console.error("Failed to mark read", err);
    }
  };

  const markAllRead = async () => {
    try {
      await axiosInstance.put("/notifications/read-all");
      setNotifications(prev =>
        prev.map(n => ({ ...n, read: true }))
      );
    } catch (err) {
      console.error("Failed to mark all read", err);
    }
  };

  // 🔁 Poll every 30s
  useEffect(() => {
    loadNotifications();
    const interval = setInterval(loadNotifications, 30000);
    return () => clearInterval(interval);
  }, []);

  // ❌ Close on outside click
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const getText = (n) => {
    switch (n.type) {
      case "follow":
        return `${n.fromUser.name} started following you`;
      case "like":
        return `${n.fromUser.name} liked your post`;
      case "comment":
        return `${n.fromUser.name} commented on your post`;
      case "save":
        return `${n.fromUser.name} saved your post`;
      case "new_post":
        return `${n.fromUser.name} posted something new`;
      default:
        return "New notification";
    }
  };

  const getLink = (n) => {
    if (n.type === "follow") return `/profile/${n.fromUser._id}`;
    if (n.post) return `/posts/${n.post._id}`;
    return "#";
  };

  return (
    <div className="relative" ref={dropdownRef}>
      {/* 🔔 ICON */}
      <button
        onClick={() => setOpen(!open)}
        className="relative p-2 rounded-full hover:bg-slate-100"
      >
        <span className="text-xl">🔔</span>

        {unreadCount > 0 && (
          <span className="absolute top-0 right-0 flex items-center justify-center w-5 h-5 text-xs text-white bg-red-500 rounded-full">
            {unreadCount}
          </span>
        )}
      </button>

      {/* 📦 DROPDOWN */}
      {open && (
        <div className="absolute right-0 z-50 mt-2 w-96 bg-white border rounded-2xl shadow-xl">
          <div className="flex items-center justify-between px-4 py-3 border-b">
            <h3 className="text-lg font-bold">Notifications</h3>
            {unreadCount > 0 && (
              <button
                onClick={markAllRead}
                className="text-sm text-indigo-600 hover:underline"
              >
                Mark all read
              </button>
            )}
          </div>

          <div className="max-h-96 overflow-y-auto">
            {notifications.length === 0 && (
              <p className="p-4 text-sm text-slate-500">
                No notifications yet
              </p>
            )}

            {notifications.map((n) => (
              <Link
                key={n._id}
                to={getLink(n)}
                onClick={() => {
                  if (!n.read) markAsRead(n._id);
                  setOpen(false);
                }}
                className={`block px-4 py-3 border-b hover:bg-slate-50 ${
                  !n.read ? "bg-indigo-50" : ""
                }`}
              >
                <p className="text-sm text-slate-800">
                  {getText(n)}
                </p>

                <p className="mt-1 text-xs text-slate-500">
                  {new Date(n.createdAt).toLocaleString()}
                </p>
              </Link>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
