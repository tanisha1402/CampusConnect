export default function ProfileCard({ form }) {
  return (
    <div className="flex flex-col items-center p-6 text-center bg-white shadow rounded-2xl">
      
      {/* Avatar */}
      {form.profilePic ? (
  <img
    src={`http://localhost:5000${form.profilePic}`}
    alt="avatar"
    className="object-cover w-24 h-24 rounded-full shadow"
  />
) : (
  <div className="flex items-center justify-center w-24 h-24 text-3xl font-bold text-white bg-indigo-300 rounded-full shadow-md">
    {form.name?.charAt(0).toUpperCase()}
  </div>
)}

      <h2 className="mt-4 text-xl font-bold">{form.name}</h2>
      <p className="capitalize text-slate-500">{form.role}</p>

      {form.department && (
        <p className="mt-1 text-sm text-slate-400">
          {form.department}
        </p>
      )}

      {form.bio && (
        <p className="mt-4 text-sm text-slate-600">
          {form.bio}
        </p>
      )}
    </div>
  );
}
