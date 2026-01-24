import { useNavigate } from "react-router-dom";
import { useContext, useEffect } from "react";
import { AuthContext } from "../context/AuthContext";

export default function GetStarted() {
  const navigate = useNavigate();
const { user } = useContext(AuthContext);

useEffect(() => {
  if (user) {
    navigate("/dashboard");
  }
}, [user, navigate]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-primarySoft via-lavender to-primarySoft flex items-center justify-center px-6">
      <div className="max-w-3xl w-full bg-white shadow-2xl rounded-3xl p-10 text-center">
        <h1 className="text-4xl font-bold text-indigo-600">
          Welcome to CampusConnect
        </h1>

        <p className="mt-4 text-lg text-slate-600">
          A private social platform for students and faculty to connect,
          share resources, join communities, and stay updated with campus life.
        </p>

        {/* FEATURES */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-10">
          <div className="p-4 bg-indigo-50 rounded-xl">
            <h3 className="font-semibold text-indigo-600">🤝 Communities</h3>
            <p className="mt-2 text-sm text-slate-600">
              Join interest-based communities and post discussions.
            </p>
          </div>

          <div className="p-4 bg-indigo-50 rounded-xl">
            <h3 className="font-semibold text-indigo-600">💬 Messaging</h3>
            <p className="mt-2 text-sm text-slate-600">
              Chat privately with students and faculty.
            </p>
          </div>

          <div className="p-4 bg-indigo-50 rounded-xl">
            <h3 className="font-semibold text-indigo-600">📢 Feed</h3>
            <p className="mt-2 text-sm text-slate-600">
              Like, comment, save posts and follow people.
            </p>
          </div>
        </div>

        {/* ACTION BUTTONS */}
        <div className="flex justify-center gap-6 mt-12">
          <button
            onClick={() => navigate("/login")}
            className="px-6 py-3 text-white bg-indigo-600 rounded-xl hover:bg-indigo-700"
          >
            Log In
          </button>

          <button
            onClick={() => navigate("/register")}
            className="px-6 py-3 border border-indigo-600 text-indigo-600 rounded-xl hover:bg-indigo-50"
          >
            Create Account
          </button>
        </div>
      </div>
    </div>
  );
}
