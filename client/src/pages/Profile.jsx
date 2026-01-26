import { useState, useEffect, useContext } from "react";
import axiosInstance from "../utils/axiosInstance";
import { AuthContext } from "../context/AuthContext";

import ProfileCard from "../components/ProfileCard";
import ProfileForm from "../components/ProfileForm";
import MyPosts from "../components/MyPosts";

export default function Profile() {
  const { setUser } = useContext(AuthContext);

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

  // 🔥 toggle edit form
  const [showEditForm, setShowEditForm] = useState(false);

  // Load profile
  useEffect(() => {
    const loadProfile = async () => {
      try {
        const res = await axiosInstance.get("/users/me");
        setForm({
          ...res.data,
          avatarFile: null,
        });

        const postRes = await axiosInstance.get(
          `/posts/user/${res.data._id}`
        );
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
      localStorage.setItem("user", JSON.stringify(res.data));

      if (form.avatarFile) {
        const fd = new FormData();
        fd.append("avatar", form.avatarFile);

        const avatarRes = await axiosInstance.put(
          "/users/me/avatar",
          fd,
          {
            headers: { "Content-Type": "multipart/form-data" },
          }
        );

        setUser(avatarRes.data);
        localStorage.setItem(
          "user",
          JSON.stringify(avatarRes.data)
        );
      }

      setSaving(false);
      setShowEditForm(false); // 🔥 close form after save
      alert("Profile updated!");
    } catch (err) {
      console.error("Error saving profile", err);
      setSaving(false);
    }
  };

  if (loading) return <p className="p-10">Loading profile…</p>;

  return (
    <div className="min-h-screen p-8 bg-slate-50">
      <div className="grid max-w-6xl grid-cols-1 gap-8 mx-auto md:grid-cols-3">

        {/* LEFT: Profile Card (FIXED) */}
        <div className="md:sticky md:top-6 max-h-[calc(100vh-3rem)] overflow-y-auto pr-2">
          <ProfileCard form={form} />

          {/* 🔥 Edit Profile Button */}
          <button
  onClick={() => setShowEditForm((prev) => !prev)}
  className="px-5 py-2 mt-4 text-white bg-indigo-600 rounded-xl hover:bg-indigo-700 w-40 mx-auto block"
>
            {showEditForm ? "Close Edit Profile" : "Edit Profile"}
          </button>

          {/* 🔥 Edit Form (TOGGLED) */}
          {showEditForm && (
            <div className="mt-4">
              <ProfileForm
                form={form}
                setForm={setForm}
                saving={saving}
                onSave={handleSave}
              />
            </div>
          )}
        </div>

        {/* RIGHT: ONLY My Posts */}
        <div className="space-y-8 md:col-span-2">
          <MyPosts posts={myPosts} setPosts={setMyPosts} />
        </div>

      </div>
    </div>
  );
}
