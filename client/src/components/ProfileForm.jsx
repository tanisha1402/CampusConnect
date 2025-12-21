export default function ProfileForm({ form, setForm, saving, onSave }) {
  return (
    <div className="p-6 space-y-4 bg-white shadow rounded-2xl">
      <h2 className="text-xl font-semibold">Edit Profile</h2>

      <input
        className="w-full p-3 border rounded-xl"
        value={form.name}
        onChange={(e) => setForm({ ...form, name: e.target.value })}
        placeholder="Full name"
      />

      <input
        className="w-full p-3 border rounded-xl bg-slate-100"
        value={form.email}
        disabled
      />

      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        <select
          className="w-full p-3 border rounded-xl"
          value={form.role}
          onChange={(e) => setForm({ ...form, role: e.target.value })}
        >
          <option value="student">Student</option>
          <option value="faculty">Faculty</option>
        </select>

        <input
          className="w-full p-3 border rounded-xl"
          value={form.department}
          onChange={(e) =>
            setForm({ ...form, department: e.target.value })
          }
          placeholder="Department"
        />
      </div>

      <textarea
        className="w-full p-3 border rounded-xl"
        value={form.bio}
        onChange={(e) => setForm({ ...form, bio: e.target.value })}
        placeholder="Short bio"
        rows={3}
      />

      <button
        onClick={onSave}
        disabled={saving}
        className="px-6 py-3 text-white transition bg-indigo-600 rounded-xl hover:bg-indigo-700"
      >
        {saving ? "Saving..." : "Save Changes"}
      </button>
    </div>
  );
}
