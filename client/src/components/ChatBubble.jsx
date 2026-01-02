export default function ChatBubble({ message, isMe }) {
  return (
    <div className={`flex ${isMe ? "justify-end" : "justify-start"}`}>
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
    </div>
  );
}
