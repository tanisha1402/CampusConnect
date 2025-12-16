import { useState, useEffect, useContext } from "react";
import axiosInstance from "../utils/axiosInstance";
import { AuthContext } from "../context/AuthContext";

export default function Profile() {
  const { user, setUser } = useContext(AuthContext);

  const [form, setForm] = useState({
    name: "",
    email: "",
    role: "",
    bio: "",
    department: "",
  });

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [myPosts, setMyPosts] = useState([]);

  // Load profile
useEffect(() => {
  const loadProfile = async () => {
    try {
      const res = await axiosInstance.get("/users/me");
      setForm(res.data);

      const postRes = await axiosInstance.get(`/posts/user/${res.data._id}`);
      setMyPosts(postRes.data);

      setLoading(false);
    } catch (err) {
      console.error("Error loading profile", err);
    }
  };

  loadProfile();
}, []);


  // Update profile
  const handleSave = async () => {
    try {
      setSaving(true);
      const res = await axiosInstance.put("/users/me", form);

      // Update context user
      setUser(res.data);

      setSaving(false);
      alert("Profile updated!");
    } catch (err) {
      console.error("Error saving profile", err);
      setSaving(false);
    }
  };

  if (loading)
    return <p className="p-10">Loading profile…</p>;

  return (
    <div className="p-10">
      <h1 className="mb-6 text-3xl font-bold text-slate-800">
        My Profile
      </h1>

      <div className="max-w-xl space-y-4">
        <input
          className="w-full p-3 border rounded-xl"
          value={form.name}
          onChange={(e) => setForm({ ...form, name: e.target.value })}
          placeholder="Full name"
        />

        <input
          className="w-full p-3 border rounded-xl bg-slate-100"
          value={form.email}
          disabled
        />

        <select
          className="w-full p-3 border rounded-xl"
          value={form.role}
          onChange={(e) => setForm({ ...form, role: e.target.value })}
        >
          <option value="student">Student</option>
          <option value="faculty">Faculty</option>
        </select>

        <input
          className="w-full p-3 border rounded-xl"
          value={form.department}
          onChange={(e) => setForm({ ...form, department: e.target.value })}
          placeholder="Department (optional)"
        />

        <textarea
          className="w-full p-3 border rounded-xl"
          value={form.bio}
          onChange={(e) => setForm({ ...form, bio: e.target.value })}
          placeholder="Short bio"
        />

        <button
          onClick={handleSave}
          className="px-6 py-3 bg-indigo-500 text-white rounded-xl hover:bg-indigo-600 hover:scale-[1.02] transition"
        >
          {saving ? "Saving..." : "Save Changes"}
        </button>
        <h2 className="mt-10 mb-4 text-2xl font-semibold">My Posts</h2>

{myPosts.length === 0 ? (
  <p className="text-slate-500">You haven't posted anything yet.</p>
) : (
  <div className="space-y-4">
    {myPosts.map((post) => (
      <div
        key={post._id}
        className="p-4 bg-white border shadow-sm rounded-xl"
      >
        <p className="text-slate-800">{post.content}</p>
        <p className="text-sm text-slate-500">
          {new Date(post.createdAt).toLocaleString()}
        </p>
      </div>
    ))}
  </div>
)}

      </div>
    </div>
  );
}
