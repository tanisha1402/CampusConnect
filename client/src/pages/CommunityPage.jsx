// src/pages/CommunityPage.jsx
import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import axiosInstance from "../utils/axiosInstance";

import CommunityAbout from "../components/CommunityAbout";
import CommunityPosts from "../components/CommunityPosts";
import JoinLeaveButton from "../components/JoinLeaveButton";
import CreateCommunityPost from "../components/CreateCommunityPost";


export default function CommunityPage() {
  const { id } = useParams();

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

        setLoading(false);
      } catch (err) {
        console.error("Failed to load community", err);
      }
    };

    loadCommunity();
  }, [id]);

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
      {community.members.includes(
  JSON.parse(localStorage.getItem("user"))?._id
) && (
  <CreateCommunityPost
    communityId={id}
    setPosts={setPosts}
  />
)}

    
      <CommunityPosts posts={posts} setPosts={setPosts} />
  
    </div>
  );
}
