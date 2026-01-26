import { useState } from "react";
import CreatePostModal from "./CreatePostModal";

export default function CreateCommunityPost({ communityId, setPosts }) {
  const [open, setOpen] = useState(false);

  return (
    <>
      {/* SLIM BAR */}
      <div
        onClick={() => setOpen(true)}
        className="flex items-center gap-3 p-4 bg-white border shadow cursor-pointer rounded-2xl hover:bg-slate-50"
      >
        <div className="flex items-center justify-center w-10 h-10 font-semibold text-white bg-indigo-400 rounded-full">
          ✏️
        </div>
        <p className="text-slate-500">
          Write something...
        </p>
      </div>

      {/* MODAL */}
      {open && (
        <CreatePostModal
          communityId={communityId}
          setPosts={setPosts}
          onClose={() => setOpen(false)}
        />
      )}
    </>
  );
}
