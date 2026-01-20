// src/pages/CommunityPage.jsx
import { useParams, useNavigate } from "react-router-dom";
import { useEffect, useState, useContext, useMemo } from "react";
import axiosInstance from "../utils/axiosInstance";

import { AuthContext } from "../context/AuthContext";

import CommunityAbout from "../components/CommunityAbout";
import CommunityPosts from "../components/CommunityPosts";
import JoinLeaveButton from "../components/JoinLeaveButton";
import CreateCommunityPost from "../components/CreateCommunityPost";
import DeleteConfirmModal from "../components/DeleteConfirmModal";

export default function CommunityPage() {
  const { id } = useParams();
  const { user } = useContext(AuthContext);

  const [community, setCommunity] = useState(null);
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
      {/* COVER IMAGE */}
<div className="relative w-full h-48 overflow-hidden shadow rounded-2xl">
  <img
    src={`http://localhost:5000${community.coverImage}`}
    alt="community cover"
    className="object-cover w-full h-full"
  />
</div>
      <CommunityAbout community={community} />

      <JoinLeaveButton
        communityId={id}
        members={community.members}
        setCommunity={setCommunity}
      />
      {isAdmin && (
  <div className="p-4 space-y-4 bg-white shadow rounded-xl">
    <h3 className="mb-2 font-bold">Admin Actions</h3>
         {/* 🔹 EDIT COVER SECTION */}
    <div className="p-3 border rounded-xl">
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
            className="w-full"
          />

          <div className="flex gap-3">
            <button
              onClick={handleUpdateCover}
              disabled={uploadingCover}
              className="px-4 py-2 text-white bg-green-600 rounded-lg hover:bg-green-700 disabled:opacity-50"
            >
              {uploadingCover ? "Uploading..." : "Save Cover"}
            </button>

            <button
              onClick={() => {
                setEditingCover(false);
                setNewCover(null);
              }}
              className="px-4 py-2 rounded-lg bg-slate-300"
            >
              Cancel
            </button>
          </div>
        </div>
      )}
    </div>
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
    {isAdmin && (
  <div className="p-4 bg-white border border-red-200 shadow rounded-xl">
    <h3 className="mb-2 font-bold text-red-600">Danger Zone</h3>

    <button
      onClick={() => setDeleteOpen(true)}
      className="px-4 py-2 text-white bg-red-600 rounded-lg hover:bg-red-700"
    >
      Delete Community
    </button>
  </div>
)}
  </div>
)}




      {/* ✅ Only members can post */}
      {isMember && (
        <CreateCommunityPost
          communityId={id}
          setPosts={setPosts}
        />
      )}

      <CommunityPosts posts={posts} setPosts={setPosts} />
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
