// src/components/CommunityAbout.jsx
export default function CommunityAbout({ community }) {
  return (
    <div className="bg-white p-6 rounded-xl shadow">
      <h1 className="text-3xl font-bold">{community.name}</h1>
      <p className="mt-2 text-slate-600">{community.description}</p>

      <p className="mt-4 text-sm text-slate-500">
        👥 {community.members.length} members
      </p>
    </div>
  );
}
