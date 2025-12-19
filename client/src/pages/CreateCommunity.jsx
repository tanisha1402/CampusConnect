import { useState } from "react";
import axiosInstance from "../utils/axiosInstance";
import { useNavigate } from "react-router-dom";

export default function CreateCommunity() {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");

  const navigate = useNavigate();

  const handleCreate = async (e) => {
    e.preventDefault();
    try {
      const res = await axiosInstance.post("/communities", {
        name,
        description,
      });

      navigate(`/communities/${res.data._id}`); // go to that community page
    } catch (err) {
      console.error("Error creating community:", err);
      alert("Failed to create community");
    }
  };

  return (
    <div className="max-w-xl p-10 mx-auto">
      <h1 className="mb-6 text-3xl font-bold">Create a Community</h1>

      <form onSubmit={handleCreate} className="space-y-4">
        <input
          type="text"
          placeholder="Community Name"
          className="w-full p-3 border rounded-lg"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
        />

        <textarea
          placeholder="Describe this community..."
          className="w-full p-3 border rounded-lg"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          required
        />

        <button className="w-full p-3 text-white bg-indigo-600 rounded-lg hover:bg-indigo-700">
          Create
        </button>
      </form>
    </div>
  );
}
