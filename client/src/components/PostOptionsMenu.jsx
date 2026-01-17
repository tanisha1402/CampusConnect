import { useState } from "react";
import axiosInstance from "../utils/axiosInstance";

export default function PostOptionsMenu({
  post,
  currentUserId,
  isSaved,
  onSaveToggle,
  onEdit,
  onDelete,
  onFollowToggle,
  isFollowing,
}) {
  const [open, setOpen] = useState(false);
  const isOwner = post.user._id === currentUserId;

  return (
    <div className="relative">
      {/* 3 DOTS */}
      <button
        onClick={() => setOpen((p) => !p)}
        className="px-2 text-xl text-slate-500 hover:text-black"
      >
        ⋯
      </button>

      {/* DROPDOWN */}
      {open && (
        <div className="absolute right-0 z-20 mt-2 overflow-hidden bg-white border shadow-xl w-44 rounded-xl">
          {isOwner ? (
            <>
              <MenuItem
                label="Edit post"
                onClick={() => {
                  onEdit();
                  setOpen(false);
                }}
              />
              <MenuItem
                label="Delete post"
                danger
                onClick={() => {
                  onDelete();
                  setOpen(false);
                }}
              />
              <MenuItem
                label={isSaved ? "Unsave post" : "Save post"}
                onClick={() => {
                  onSaveToggle();
                  setOpen(false);
                }}
              />
            </>
          ) : (
            <>
              <MenuItem
                label={isFollowing ? "Unfollow user" : "Follow user"}
                onClick={() => {
                  onFollowToggle();
                  setOpen(false);
                }}
              />
              <MenuItem
                label={isSaved ? "Unsave post" : "Save post"}
                onClick={() => {
                  onSaveToggle();
                  setOpen(false);
                }}
              />
            </>
          )}
        </div>
      )}
    </div>
  );
}

function MenuItem({ label, onClick, danger }) {
  return (
    <button
      onClick={onClick}
      className={`w-full px-4 py-2 text-sm text-left hover:bg-slate-100 ${
        danger ? "text-red-600" : "text-slate-700"
      }`}
    >
      {label}
    </button>
  );
}
