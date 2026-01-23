import { useState, useEffect, useContext } from "react";
import axiosInstance from "../utils/axiosInstance";
import { AuthContext } from "../context/AuthContext";

import ProfileCard from "../components/ProfileCard";
import ProfileForm from "../components/ProfileForm";
import MyPosts from "../components/MyPosts";

export default function Profile() {
  const {setUser } = useContext(AuthContext);

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
      setForm({
  ...res.data,
  avatarFile: null,
});


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
localStorage.setItem("user", JSON.stringify(res.data));

      setSaving(false);
      if (form.avatarFile) {
  const fd = new FormData();
  fd.append("avatar", form.avatarFile);

  const res = await axiosInstance.put("/users/me/avatar", fd, {
    headers: { "Content-Type": "multipart/form-data" },
  });

  setUser(res.data);
  localStorage.setItem("user", JSON.stringify(res.data));
}
      alert("Profile updated!");
    } catch (err) {
      console.error("Error saving profile", err);
      setSaving(false);
    }
  };

  if (loading)
    return <p className="p-10">Loading profile…</p>;

  return (
  <div className="min-h-screen p-8 bg-slate-50">
    <div className="grid max-w-6xl grid-cols-1 gap-8 mx-auto md:grid-cols-3">
      
      {/* LEFT: Profile Card */}
      <ProfileCard form={form} />

      {/* RIGHT: Edit + Posts */}
      <div className="space-y-8 md:col-span-2">
        <ProfileForm
          form={form}
          setForm={setForm}
          saving={saving}
          onSave={handleSave}
        />

        <MyPosts posts={myPosts} />
      </div>

    </div>
  </div>
);

}
