import { useEffect, useState, useContext } from "react";
import { useParams } from "react-router-dom";
import axiosInstance from "../utils/axiosInstance";
import { AuthContext } from "../context/AuthContext";
import ChatBubble from "../components/ChatBubble";

export default function Chat() {
  const { id } = useParams(); // conversationId
  const { user } = useContext(AuthContext);

  const [messages, setMessages] = useState([]);
  const [text, setText] = useState("");

  useEffect(() => {
    const loadMessages = async () => {
      const res = await axiosInstance.get(`/messages/${id}`);
      setMessages(res.data);
    };
    loadMessages();
  }, [id]);

  const sendMessage = async () => {
    if (!text.trim()) return;

    const res = await axiosInstance.post(`/messages/${id}`, {
      text,
    });

    setMessages((prev) => [...prev, res.data]);
    setText("");
  };

  return (
    <div className="flex flex-col max-w-3xl mx-auto h-[80vh] bg-white shadow rounded-xl">
      
      {/* Messages */}
      <div className="flex-1 p-4 space-y-3 overflow-y-auto">
  {messages.length === 0 ? (
    <p className="mt-10 text-center text-slate-400">
      No messages yet. Say hi 👋
    </p>
  ) : (
    messages.map((m) => (
      <ChatBubble
        key={m._id}
        message={m}
        isMe={m.sender === user._id}
      />
    ))
  )}
</div>


      {/* Input */}
      <div className="flex gap-2 p-4 border-t">
        <input
          className="flex-1 p-3 border rounded-full"
          placeholder="Type a message..."
          value={text}
          onChange={(e) => setText(e.target.value)}
        />
        <button
          onClick={sendMessage}
          className="px-5 py-2 text-white bg-indigo-600 rounded-full"
        >
          Send
        </button>
      </div>
    </div>
  );
}
