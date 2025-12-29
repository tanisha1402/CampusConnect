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
      <CommunityAbout community={community} />

      <JoinLeaveButton
        communityId={id}
        members={community.members}
        setCommunity={setCommunity}
      />
      {isAdmin && (
  <div className="p-4 bg-white shadow rounded-xl">
    <h3 className="mb-2 font-bold">Admin Actions</h3>

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
  <div className="p-4 bg-white shadow rounded-xl border border-red-200">
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
