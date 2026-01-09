import { useContext } from "react";
import { AuthContext } from "../context/AuthContext";

export default function ConversationItem({ conversation, onClick }) {
  const { user } = useContext(AuthContext);

  const otherUser = conversation.participants.find(
    (p) => p._id !== user._id
  );

  return (
    <div
      onClick={onClick}
      className="flex items-center gap-4 p-4 bg-white shadow cursor-pointer rounded-xl hover:bg-indigo-50"
    >
      <div className="flex items-center justify-center w-12 h-12 text-lg font-bold text-white bg-indigo-500 rounded-full">
        {otherUser.name.charAt(0).toUpperCase()}
      </div>

      <div className="flex-1">
        <p className="font-semibold">{otherUser.name}</p>
        <p className="text-sm truncate text-slate-500">
          {conversation.lastMessage?.text || "No messages yet. Say hi 👋"}
        </p>
      </div>
      {conversation.unreadCount > 0 && (
    <span className="px-2 py-1 text-xs text-white bg-red-500 rounded-full">
      {conversation.unreadCount}
    </span>
  )}
    </div>
  );
}
