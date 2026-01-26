export default function ChatBubble({ message, isMe }) {
  const sender = message.senderUser || message.sender;
 // populated sender object

  return (
    <div className={`flex items-end gap-2 ${isMe ? "justify-end" : "justify-start"}`}>
      
      {/* Avatar (left for them) */}
      {!isMe && (
        sender?.profilePic ? (
          <img
            src={`http://localhost:5000${sender.profilePic}`}
            alt="avatar"
            className="object-cover w-8 h-8 rounded-full shadow"
          />
        ) : (
          <div className="flex items-center justify-center w-8 h-8 text-xs font-bold text-white bg-indigo-400 rounded-full">
            {sender?.name?.charAt(0)?.toUpperCase() || "U"}
          </div>
        )
      )}

      {/* Bubble */}
      <div
        className={`px-4 py-2 rounded-2xl max-w-[70%] ${
          isMe
            ? "bg-indigo-600 text-white rounded-br-none"
            : "bg-slate-200 text-slate-800 rounded-bl-none"
        }`}
      >
        <p>{message.text}</p>
        <p className="mt-1 text-xs opacity-70">
          {new Date(message.createdAt).toLocaleTimeString()}
        </p>
      </div>

      {/* Avatar (right for me) */}
      {isMe && (
        sender?.profilePic ? (
          <img
            src={`http://localhost:5000${sender.profilePic}`}
            alt="avatar"
            className="object-cover w-8 h-8 rounded-full shadow"
          />
        ) : (
          <div className="flex items-center justify-center w-8 h-8 text-xs font-bold text-white bg-indigo-400 rounded-full">
            {sender?.name?.charAt(0)?.toUpperCase() || "U"}
          </div>
        )
      )}
    </div>
  );
}
