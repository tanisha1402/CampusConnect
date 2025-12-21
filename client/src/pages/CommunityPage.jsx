// src/pages/CommunityPage.jsx
import { useParams } from "react-router-dom";
import { useEffect, useState, useContext, useMemo } from "react";
import axiosInstance from "../utils/axiosInstance";

import { AuthContext } from "../context/AuthContext";

import CommunityAbout from "../components/CommunityAbout";
import CommunityPosts from "../components/CommunityPosts";
import JoinLeaveButton from "../components/JoinLeaveButton";
import CreateCommunityPost from "../components/CreateCommunityPost";

export default function CommunityPage() {
  const { id } = useParams();
  const { user } = useContext(AuthContext);

  const [community, setCommunity] = useState(null);
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);

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
      (member) =>
        member === user._id || member?._id === user._id
    );
  }, [community, user]);

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

      {/* ✅ Only members can post */}
      {isMember && (
        <CreateCommunityPost
          communityId={id}
          setPosts={setPosts}
        />
      )}

      <CommunityPosts posts={posts} setPosts={setPosts} />
    </div>
  );
}
