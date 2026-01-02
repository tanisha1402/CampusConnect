import { useEffect, useState } from "react";
import axiosInstance from "../utils/axiosInstance";
import { useNavigate } from "react-router-dom";
import ConversationItem from "../components/ConversationItem";

export default function Inbox() {
  const [conversations, setConversations] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const loadInbox = async () => {
      try {
        const res = await axiosInstance.get("/messages/inbox");
        setConversations(res.data);
      } catch (err) {
        console.error("Inbox error", err);
      }
    };
    loadInbox();
  }, []);

  return (
    <div className="max-w-3xl p-6 mx-auto space-y-4">
      <h1 className="text-2xl font-bold">Messages</h1>

      {conversations.length === 0 ? (
        <p className="text-slate-500">No conversations yet</p>
      ) : (
        conversations.map((c) => (
          <ConversationItem
            key={c._id}
            conversation={c}
            onClick={() => navigate(`/messages/${c._id}`)}
          />
        ))
      )}
    </div>
  );
}
