import { useEffect, useState } from "react";
import api from "../services/api";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import type { User } from "../types";
import Navbar from "../components/Navbar";
import { ArrowLeft } from "lucide-react";
import toast from "react-hot-toast";

const CreateTask = () => {
  const [workers, setWorkers] = useState<User[]>([]);
  const [title, setTitle] = useState("");
  const [loading, setLoading] = useState(true)
  const [description, setDescription] = useState("");
  const [assign, setAssign] = useState("");
  const navigate = useNavigate();
  const { user } = useAuth();

  useEffect(() => {
    const fetchWorkers = async () => {
      try {
        await new Promise(resolve => setTimeout(resolve, 1000));
        const response = await api.get("/user/worker");
        setWorkers(response.data);
      } catch (error) {
        console.log("Error fetching data: ", error);
      }
      finally{
        setLoading(false)
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
        toast.success('Task created successfully!')
        navigate("/dashboard");
      }
    } catch (error: any) {
      const msg = error.response?.data?.message || "Submission failed";
      toast.error(msg)
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-linear-to-bl from-violet-500 to-fuchsia-600 p-4">
      <Navbar />
      <div className="flex-1 flex flex-col p-6">
    <button
        type="button"
        onClick={() => navigate("/dashboard")}
        className="w-11 h-11 rounded-full backdrop-blur-lg bg-white/20 border border-white/30 flex items-center justify-center text-white hover:bg-white/30 transition mb-4 cursor-pointer"
    >
        <ArrowLeft size={20} />
    </button>

      <div className="flex-1 flex items-center justify-center">
        <div className="backdrop-blur-lg bg-white/20 border border-white/30 rounded-2xl shadow-xl p-8 w-full max-w-md">
          <h1 className="text-2xl font-bold text-white text-center mb-6">
            Create Task
          </h1>

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

          <div className="mb-4">
            <textarea
              placeholder="Description here"
              value={description}
              required
              onChange={(e) => setDescription(e.target.value)}
              rows={5}
              className="w-full px-4 py-2 rounded-lg bg-white/40 placeholder-gray-700 text-gray-900 outline-none focus:ring-2 focus:ring-white"
            />
          </div>

          <div className="mb-6">
               {loading ? (
        <div className="w-full px-4 py-2 rounded-lg bg-white/40 text-gray-700 text-sm">
            Loading workers...
        </div>
    ) : (
        <select
            value={assign}
            onChange={(e) => setAssign(e.target.value)}
            className="w-full px-4 py-2 rounded-lg bg-white/40 text-gray-900 outline-none focus:ring-2 focus:ring-white"
        >
            <option value="">Select Worker</option>
            {workers.map((w) => (
                <option key={w.id} value={w.id}>
                    {w.name}
                </option>
            ))}
        </select>
    )}
          </div>

          <button
            type="button"
            onClick={handleSubmit}
            className="w-full bg-white/80 hover:bg-white text-fuchsia-700 font-semibold py-2 rounded-lg transition disabled:opacity-50"
          >
            Submit
          </button>          
        </div>
      </div>
      </div>
    </div>
  );
};

export default CreateTask;