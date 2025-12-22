// src/components/CommunityAbout.jsx
export default function CommunityAbout({ community }) {
  return (
    <div className="p-6 bg-white shadow rounded-xl">
      <h1 className="text-3xl font-bold">{community.name}</h1>
      <p className="mt-2 text-slate-600">{community.description}</p>

      <p className="mt-4 text-sm text-slate-500">
        👥 {community.members.length} members
      </p>
      <p className="mt-2 text-sm text-slate-500">
  👥 {community.members.length} members ·
  👑 {
    community.members.filter(m => m.role === "admin").length
  } admin(s)
</p>

    </div>
  );
}
