// src/pages/CommunityPage.jsx
import { useParams, useNavigate } from "react-router-dom";
import { useEffect, useState, useContext, useMemo } from "react";
import axiosInstance from "../utils/axiosInstance";

import { AuthContext } from "../context/AuthContext";

import CommunityPosts from "../components/CommunityPosts";
import JoinLeaveButton from "../components/JoinLeaveButton";
import CreateCommunityPost from "../components/CreateCommunityPost";
import DeleteConfirmModal from "../components/DeleteConfirmModal";

export default function CommunityPage() {
  const { id } = useParams();
  const { user } = useContext(AuthContext);
  const [community, setCommunity] = useState(null);
  
  const [activeTab, setActiveTab] = useState("posts"); // posts | members | about

  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [editingCover, setEditingCover] = useState(false);
  const [newCover, setNewCover] = useState(null);
  const [uploadingCover, setUploadingCover] = useState(false);



  useEffect(() => {
    const loadCommunity = async () => {
      try {
        const communityRes = await axiosInstance.get(`/communities/${id}`);
        setCommunity(communityRes.data);

        const postsRes = await axiosInstance.get(`/posts/community/${id}`);
        setPosts(postsRes.data);
      } catch (err) {
        console.error("Failed to load community", err);
      } finally {
        setLoading(false);
      }
    };

    loadCommunity();
  }, [id]);

  // ✅ Normalize member IDs safely
  const isMember = useMemo(() => {
  if (!user || !community) return false;

  return community.members.some(
    (m) => m.user?._id === user._id
  );
}, [community, user]);

const isAdmin = useMemo(() => {
  if (!user || !community) return false;

  return community.members.some(
    (m) =>
      m.user?._id === user._id && m.role === "admin"
  );
}, [community, user]);

const handleUpdateCover = async () => {
  if (!newCover) return;

  try {
    setUploadingCover(true);
    const formData = new FormData();
    formData.append("cover", newCover);

    const res = await axiosInstance.put(
      `/communities/${id}/cover`,
      formData,
      { headers: { "Content-Type": "multipart/form-data" } }
    );

    setCommunity(res.data);
    setEditingCover(false);
    setNewCover(null);
  } catch (err) {
    console.error("Update cover error:", err);
    alert(err.response?.data?.message || "Failed to update cover");
  } finally {
    setUploadingCover(false);
  }
};

const handleDeleteCommunity = async () => {
  try {
    setDeleting(true);
    await axiosInstance.delete(`/communities/${id}`);
    navigate("/dashboard"); // ✅ redirect after delete
  } catch (err) {
    alert(err.response?.data?.message || "Failed to delete community");
  } finally {
    setDeleting(false);
    setDeleteOpen(false);
  }
};


  if (loading) return <p className="p-6">Loading community...</p>;
  if (!community) return <p className="p-6">Community not found</p>;

  return (
    <div className="max-w-5xl p-6 mx-auto space-y-6">
 {/* COVER + HEADER */}
<div className="relative overflow-hidden shadow rounded-3xl">
  {/* Cover */}
  <div className="w-full h-56">
    <img
      src={`http://localhost:5000${community.coverImage}`}
      alt="community cover"
      className="object-cover w-full h-full"
    />
  </div>

  {/* Overlay Card */}
  <div className="relative z-10 -mt-20 p-6 mx-6 bg-white shadow-xl rounded-2xl">
    <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
      
      {/* LEFT INFO */}
      <div>
        <h1 className="text-3xl font-bold">{community.name}</h1>
        <p className="mt-2 text-slate-600">
          {community.description}
        </p>
        <p className="mt-3 text-sm text-slate-500">
          👥 {community.members.length} members · 👑{" "}
          {community.members.filter(m => m.role === "admin").length} admin(s)
        </p>
      </div>

      {/* RIGHT ACTIONS */}
      <div className="flex items-center gap-3">
        {isAdmin && (
          <span className="px-3 py-1 text-sm font-semibold text-indigo-600 bg-indigo-100 rounded-full">
            Admin
          </span>
        )}

        <JoinLeaveButton
          communityId={id}
          members={community.members}
          setCommunity={setCommunity}
        />
      </div>
    </div>
  </div>
</div>
{/* TABS */}
<div className="flex gap-6 mt-8 border-b">
  {["posts", "members", "about"].map((tab) => (
    <button
      key={tab}
      onClick={() => setActiveTab(tab)}
      className={`pb-3 font-semibold capitalize transition ${
        activeTab === tab
          ? "border-b-2 border-indigo-600 text-indigo-600"
          : "text-slate-500 hover:text-indigo-600"
      }`}
    >
      {tab}
    </button>
  ))}
</div>


     {/* ABOUT TAB */}
{activeTab === "about" && (
  <div className="mt-6 space-y-6">

    {/* COMMUNITY INFO */}
    <div className="p-6 bg-white shadow rounded-2xl">
      <h2 className="mb-2 text-xl font-bold">About this community</h2>
      <p className="text-slate-600">{community.description}</p>
    </div>

    {/* ADMIN PANEL */}
    {isAdmin && (
      <div className="p-6 space-y-4 bg-white border shadow rounded-2xl border-indigo-200">
        <h3 className="text-lg font-bold text-indigo-600">
          Admin Panel
        </h3>

        {/* EDIT COVER */}
        <div className="p-4 border rounded-xl">
          {!editingCover ? (
            <button
              onClick={() => setEditingCover(true)}
              className="px-4 py-2 text-white bg-indigo-500 rounded-lg hover:bg-indigo-600"
            >
              Edit Cover Page
            </button>
          ) : (
            <div className="space-y-3">
              <input
                type="file"
                accept="image/*"
                onChange={(e) => setNewCover(e.target.files[0])}
              />
              <div className="flex gap-3">
                <button
                  onClick={handleUpdateCover}
                  disabled={uploadingCover}
                  className="px-4 py-2 text-white bg-green-600 rounded-lg"
                >
                  {uploadingCover ? "Uploading..." : "Save Cover"}
                </button>
                <button
                  onClick={() => {
                    setEditingCover(false);
                    setNewCover(null);
                  }}
                  className="px-4 py-2 bg-slate-300 rounded-lg"
                >
                  Cancel
                </button>
              </div>
            </div>
          )}
        </div>

        {/* MEMBERS ROLE MANAGEMENT */}
        <div className="p-4 border rounded-xl">
          <h4 className="mb-3 font-semibold">Manage Members</h4>

          {community.members.map((m) => (
            <div
              key={m.user._id}
              className="flex items-center justify-between py-2"
            >
              <span>
                {m.user.name}
                {m.role === "admin" && " 👑"}
              </span>

              {m.user._id !== user._id && (
                <button
                  onClick={async () => {
                    const res = await axiosInstance.put(
                      `/communities/${id}/admins/${m.user._id}`
                    );
                    setCommunity(res.data);
                  }}
                  className="px-3 py-1 text-sm text-white bg-indigo-500 rounded-lg"
                >
                  {m.role === "admin" ? "Remove Admin" : "Make Admin"}
                </button>
              )}
            </div>
          ))}
        </div>

        {/* DANGER ZONE */}
        <div className="p-4 border border-red-200 rounded-xl bg-red-50">
          <h4 className="mb-2 font-bold text-red-600">Danger Zone</h4>
          <button
            onClick={() => setDeleteOpen(true)}
            className="px-4 py-2 text-white bg-red-600 rounded-lg"
          >
            Delete Community
          </button>
        </div>
      </div>
    )}
  </div>
)}


      {/* POSTS TAB */}
{activeTab === "posts" && (
  <>
    {isMember && (
      <CreateCommunityPost
        communityId={id}
        setPosts={setPosts}
      />
    )}

    <CommunityPosts posts={posts} setPosts={setPosts} />
  </>
)}
{/* MEMBERS TAB */}
{activeTab === "members" && (
  <div className="p-6 mt-6 bg-white shadow rounded-2xl">
    <h2 className="mb-4 text-xl font-bold">Members</h2>

    <div className="space-y-3">
      {community.members.map((m) => (
        <div
          key={m.user._id}
          className="flex items-center justify-between p-3 border rounded-xl"
        >
          <div className="flex items-center gap-3">
            <div className="flex items-center justify-center w-10 h-10 font-bold text-white bg-indigo-400 rounded-full">
              {m.user.name.charAt(0).toUpperCase()}
            </div>
            <div>
              <p className="font-semibold">{m.user.name}</p>
              <p className="text-xs text-slate-500 capitalize">
                {m.role}
              </p>
            </div>
          </div>

          {m.role === "admin" && (
            <span className="text-sm text-indigo-600">👑 Admin</span>
          )}
        </div>
      ))}
    </div>
  </div>
)}

      {deleteOpen && (
  <DeleteConfirmModal
    title="Delete Community"
    message="This will permanently delete the community and all its posts. This action cannot be undone."
    onCancel={() => setDeleteOpen(false)}
    onConfirm={handleDeleteCommunity}
    loading={deleting}
  />
)}
    </div>
  );
}
