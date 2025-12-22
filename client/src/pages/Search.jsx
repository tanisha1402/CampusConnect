import { useEffect, useState } from "react";
import axiosInstance from "../utils/axiosInstance";
import { useNavigate } from "react-router-dom";

export default function Search() {
  const [query, setQuery] = useState("");
  const [communities, setCommunities] = useState([]);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  useEffect(() => {
    if (!query.trim()) {
      setCommunities([]);
      setUsers([]);
      return;
    }

    const search = async () => {
      try {
        setLoading(true);

        const [commRes, userRes] = await Promise.all([
          axiosInstance.get(`/communities?search=${query}`),
          axiosInstance.get(`/users?search=${query}`)
        ]);

        setCommunities(commRes.data);
        setUsers(userRes.data);
      } catch (err) {
        console.error("Search error", err);
      } finally {
        setLoading(false);
      }
    };

    const delay = setTimeout(search, 400); // debounce
    return () => clearTimeout(delay);
  }, [query]);

  return (
    <div className="max-w-5xl p-6 mx-auto space-y-8">
      {/* Search Bar */}
      <input
        className="w-full p-4 text-lg border rounded-xl focus:ring-2 focus:ring-indigo-400"
        placeholder="Search communities or users..."
        value={query}
        onChange={(e) => setQuery(e.target.value)}
      />

      {loading && <p className="text-slate-500">Searching...</p>}

      {/* Communities */}
      <div>
        <h2 className="mb-3 text-xl font-bold">Communities</h2>
        {communities.length === 0 ? (
          <p className="text-slate-500">No communities found</p>
        ) : (
          <div className="space-y-2">
            {communities.map((c) => (
              <div
                key={c._id}
                onClick={() => navigate(`/communities/${c._id}`)}
                className="p-4 bg-white border cursor-pointer rounded-xl hover:bg-indigo-50"
              >
                <p className="font-semibold">#{c.name}</p>
                <p className="text-sm text-slate-500">
                  {c.members.length} members
                </p>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Users */}
      <div>
        <h2 className="mb-3 text-xl font-bold">Users</h2>
        {users.length === 0 ? (
          <p className="text-slate-500">No users found</p>
        ) : (
          <div className="space-y-2">
            {users.map((u) => (
              <div
                key={u._id}
                onClick={() => navigate(`/profile/${u._id}`)}
                className="p-4 bg-white border cursor-pointer rounded-xl hover:bg-indigo-50"
              >
                <p className="font-semibold">{u.name}</p>
                <p className="text-sm text-slate-500">{u.email}</p>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
