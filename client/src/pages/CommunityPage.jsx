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
  const [adminTab, setAdminTab] = useState("make"); // make | cover | delete
const [searchTerm, setSearchTerm] = useState("");
const [selectedMember, setSelectedMember] = useState(null);
const [confirmAdminOpen, setConfirmAdminOpen] = useState(false);




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

const filteredMembers = useMemo(() => {
  if (!community) return [];
  return community.members.filter(
  (m) =>
    m.user &&
    m.user.name.toLowerCase().includes(searchTerm.toLowerCase())
);
}, [community, searchTerm]);

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

const handleMakeAdmin = async () => {
  if (!selectedMember) return;

  try {
    const res = await axiosInstance.put(
      `/communities/${id}/admins/${selectedMember.user._id}`
    );
    setCommunity(res.data);
    setConfirmAdminOpen(false);
    setSelectedMember(null);
    setSearchTerm("");
  } catch (err) {
    alert("Failed to make admin");
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
        <p className="mt-3 text-sm text-slate-500">
          {community.members.length} members
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
  <div className="p-6 bg-white border shadow rounded-2xl border-indigo-200">
    
    <h3 className="mb-6 text-xl font-bold text-indigo-600">
      Community Admin Panel
    </h3>

    {/* ADMIN TABS */}
    <div className="flex gap-6 mb-6 border-b">
      {[
        { id: "make", label: "Make Admin" },
        { id: "cover", label: "Edit Cover" },
        { id: "delete", label: "Delete Community" },
      ].map((tab) => (
        <button
          key={tab.id}
          onClick={() => setAdminTab(tab.id)}
          className={`pb-3 font-semibold transition ${
            adminTab === tab.id
              ? "border-b-2 border-indigo-600 text-indigo-600"
              : "text-slate-500 hover:text-indigo-600"
          }`}
        >
          {tab.label}
        </button>
      ))}
    </div>

    {/* 🟣 MAKE ADMIN TAB */}
    {adminTab === "make" && (
      <div className="space-y-5">

        {/* SEARCH BAR */}
        <input
          type="text"
          placeholder="Search member by name..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full p-3 border rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-300"
        />

        {/* MEMBERS LIST */}
        <div className="space-y-3 max-h-64 overflow-y-auto">
          {filteredMembers.map((m) => (
            <div
              key={m.user._id}
              className="flex items-center justify-between p-3 border rounded-xl hover:bg-slate-50"
            >
              <div>
                <p className="font-semibold">{m.user.name}</p>
                <p className="text-xs text-slate-500 capitalize">
                  {m.role}
                </p>
              </div>

              {m.role !== "admin" && m.user._id !== user._id && (
                <button
                  onClick={() => {
                    setSelectedMember(m);
                    setConfirmAdminOpen(true);
                  }}
                  className="px-4 py-1 text-sm text-white bg-indigo-500 rounded-lg hover:bg-indigo-600"
                >
                  Make Admin
                </button>
              )}

              {m.role === "admin" && (
                <span className="text-sm text-indigo-600">👑 Admin</span>
              )}
            </div>
          ))}
        </div>
      </div>
    )}

    {/* 🟣 EDIT COVER TAB */}
    {adminTab === "cover" && (
      <div className="space-y-6">

        <div className="overflow-hidden border rounded-2xl">
          <img
            src={`http://localhost:5000${community.coverImage}`}
            alt="current cover"
            className="object-cover w-full h-48"
          />
        </div>

        {!editingCover ? (
          <button
            onClick={() => setEditingCover(true)}
            className="px-6 py-3 text-white bg-indigo-500 rounded-xl hover:bg-indigo-600"
          >
            Change Cover Image
          </button>
        ) : (
          <div className="p-4 space-y-4 border rounded-xl bg-slate-50">
            <input
              type="file"
              accept="image/*"
              onChange={(e) => setNewCover(e.target.files[0])}
            />

            <div className="flex gap-3">
              <button
                onClick={handleUpdateCover}
                disabled={uploadingCover}
                className="px-5 py-2 text-white bg-green-600 rounded-lg"
              >
                {uploadingCover ? "Uploading..." : "Save New Cover"}
              </button>

              <button
                onClick={() => {
                  setEditingCover(false);
                  setNewCover(null);
                }}
                className="px-5 py-2 bg-slate-300 rounded-lg"
              >
                Cancel
              </button>
            </div>
          </div>
        )}
      </div>
    )}

    {/* 🟣 DELETE COMMUNITY TAB */}
    {adminTab === "delete" && (
      <div className="p-6 space-y-4 border border-red-200 rounded-xl bg-red-50">

        <h4 className="text-lg font-bold text-red-600">
          Danger Zone
        </h4>

        <p className="text-slate-700">
          Deleting this community will permanently remove:
        </p>

        <ul className="ml-5 text-sm list-disc text-slate-600">
          <li>All posts</li>
          <li>All members</li>
          <li>All admin roles</li>
        </ul>

        <button
          onClick={() => setDeleteOpen(true)}
          className="px-6 py-3 mt-3 text-white bg-red-600 rounded-xl hover:bg-red-700"
        >
          Delete Community Forever
        </button>
      </div>
    )}
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

{/* CONFIRM MAKE ADMIN MODAL */}
{confirmAdminOpen && selectedMember && (
  <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
    <div className="p-6 bg-white rounded-2xl w-[420px]">
      <h2 className="mb-4 text-xl font-bold text-indigo-600">
        Confirm Admin Promotion
      </h2>

      <p className="mb-6 text-slate-700">
        Are you sure you want to make{" "}
        <span className="font-semibold">
          {selectedMember.user.name}
        </span>{" "}
        an admin of this community?
      </p>

      <div className="flex justify-end gap-3">
        <button
          onClick={() => {
            setConfirmAdminOpen(false);
            setSelectedMember(null);
          }}
          className="px-4 py-2 bg-slate-300 rounded-lg"
        >
          Cancel
        </button>

        <button
          onClick={handleMakeAdmin}
          className="px-4 py-2 text-white bg-indigo-600 rounded-lg"
        >
          Yes, Make Admin
        </button>
      </div>
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
