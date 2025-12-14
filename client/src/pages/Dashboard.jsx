import React from "react";

export default function Dashboard() {
  return (
    <div className="min-h-screen bg-base-200 p-10">
      <div className="max-w-3xl mx-auto">
        <h1 className="text-3xl font-bold mb-4">Dashboard</h1>
        <p className="text-lg opacity-70">
          Welcome to your campus dashboard 🎓
        </p>

        <div className="mt-6 card bg-base-100 p-6 shadow-md">
          <h2 className="text-xl font-semibold mb-2">Your Posts</h2>
          <p className="opacity-75">Posts feature coming soon...</p>
        </div>
      </div>
    </div>
  );
}
