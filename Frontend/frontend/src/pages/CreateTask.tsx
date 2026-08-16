import React, { useEffect, useState } from "react";
import api from "../services/api";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import type { User } from "../types";

const CreateTask = () => {
  const [workers, setWorkers] = useState<User[]>([]);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [assign, setAssign] = useState("");
  const navigate = useNavigate();
  const { user } = useAuth();

  useEffect(() => {
    const fetchWorkers = async () => {
      try {
        const response = await api.get("/user/worker");
        setWorkers(response.data);
      } catch (error) {
        console.log("Error fetching data: ", error);
      }
    };
    fetchWorkers();
  }, []);

  const handleSubmit = async () => {
    try {
      const payload = {
        title: title,
        description: description,
        assignedTo: assign,
        createdBy: user?.id,
      };
      const response = await api.post("/task/create", payload);
      if (response.status === 201) {
        navigate("/dashboard");
      }
    } catch (error: any) {
      const msg = error.response?.data?.message || "Submission failed";
      alert("ERROR CAUGHT: " + msg);
    }
  };
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-sky-300 to-sky-500 p-6">
      <div className="backdrop-blur-lg bg-white/20 border border-white/30 rounded-2xl shadow-xl p-8 w-full max-w-md">
        <h1 className="text-2xl font-bold text-white text-center mb-6">
          Create Task
        </h1>

        {/* Title input - khud likho */}
        <div className="mb-4">
          <input
            type="text"
            placeholder="Title"
            value={title}
            required
            onChange={(e) => setTitle(e.target.value)}
            className="w-full px-4 py-2 rounded-lg bg-white/40 placeholder-gray-700 text-gray-900 outline-none focus:ring-2 focus:ring-white"
          />
        </div>
        {/* Description textarea - khud likho */}
        <div className="mb-4">
          <textarea
            id="text"
            placeholder="Description here"
            value={description}
            required
            onChange={(e) => setDescription(e.target.value)}
            rows={5}
            cols={40}
            className="w-full px-4 py-2 rounded-lg bg-white/40 placeholder-gray-700 text-gray-900 outline-none focus:ring-2 focus:ring-white"
          />
        </div>
        {/* Workers dropdown - khud likho, workers.map() use karke options banao */}
        <div className="mb-4">
        <select value={assign} onChange={(e) => setAssign(e.target.value)}
            className={`px-4 py-1 border rounded-full text-sm font-medium}`}
            >
          <option value="">Select Worker</option>
          {workers.map((w) => (
            <option key={w.id} value={w.id}>
              {w.name}
            </option>
          ))}
        </select>
        </div>
        {/* Submit button - onClick={handleSubmit} */}
         <button
            type="button"
            onClick={handleSubmit}            
            className="w-full bg-white/80 hover:bg-white text-sky-700 font-semibold py-2 rounded-lg transition disabled:opacity-50"
          >
            Submit
          </button>
      </div>
    </div>
  );
};

export default CreateTask;
