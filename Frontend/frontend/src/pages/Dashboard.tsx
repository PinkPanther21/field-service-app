import { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext";
import type { Task } from "../types";
import api from "../services/api";
import { useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";
import LoadingSpinner from "../components/LoadingSpinner";

const Dashboard = () => {
  const { user } = useAuth();
  const [loading, setLoading] = useState(true)
  const [task, setTask] = useState<Task[]>([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchTask = async () => {
      try {
        await new Promise(resolve => setTimeout(resolve, 1000));
        const response = await api.get("/task");
        setTask(response.data);
      } catch (error) {
        console.log("Error fetching data: ", error);
      }
      finally {
        setLoading(false)
      }
    };
    fetchTask();
  }, []);

  const statusStyles: Record<Task["status"], string> = {
    pending: "bg-amber-100 text-amber-800 border-amber-300",
    in_progress: "bg-yellow-100 text-yellow-800 border-yellow-300",
    done: "bg-green-100 text-green-800 border-green-300",
  };

  const handleStatusUpdate = async (
    taskId: string,
    newStatus: Task["status"],
  ) => {
    try {
      await api.patch(`/task/${taskId}`, { status: newStatus });

      setTask((prevTasks) =>
        prevTasks.map((t) =>
          t.id === taskId ? { ...t, status: newStatus } : t,
        ),
      );
    } catch (error) {
      console.log("Error updating status:", error);
    }
  };

  const handleDelete = async (taskId: string) => {
    try {
      await api.delete(`/task/${taskId}`);
      setTask((prevTask) => prevTask.filter((t) => t.id !== taskId));
    } catch (error) {
      console.log("Error deleting task:", error);
    }
  };
  return (
    <div className="min-h-screen flex flex-col p-6 bg-linear-to-bl from-violet-500 to-fuchsia-600">
      <Navbar />

      <div className="w-full max-w-7xl mt-6">
        <div className="flex justify-between">
          <h2 className="text-xl font-semibold text-white mb-4">
            Task For The Day
          </h2>
          {user?.role === "admin" && (
            <button
              onClick={() => navigate("/dashboard/create-task")}
              className="text-white font-semibold cursor-pointer transition-transform duration-200 hover:scale-110"
            >
              + Create Task
            </button>
          )}
        </div>
        {loading ? (
          <LoadingSpinner />
        ) : (
          <div className="w-full max-w-6xl mt-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {task.map((t) => (
            <div
              key={t.id}
              className="rounded-2xl flex flex-col justify-between p-6 bg-white/30 backdrop-blur-md border border-white/30 hover:scale-105 transition-transform duration-200 cursor-pointer"
            >
              <div>
                <p className="text-xl font-semibold text-white mb-2">
                  {t.title}
                </p>
                <p className="text-sm text-white/80">{t.description}</p>
                <p className="text-sm text-white font-medium mt-2">
                  Assigned to: {t.assignedTo.name}
                </p>
              </div>
              <div className="mt-4">
                {user?.role === "worker" ? (
                  <select
                    value={t.status}
                    onChange={(e) =>
                      handleStatusUpdate(t.id, e.target.value as Task["status"])
                    }
                    className={`px-4 py-1 border rounded-full text-sm font-medium ${statusStyles[t.status]}`}
                  >
                    <option value="pending">Pending</option>
                    <option value="in_progress">In Progress</option>
                    <option value="done">Done</option>
                  </select>
                ) : (
                  <p
                    className={`px-4 py-1 border rounded-full text-sm font-medium ${statusStyles[t.status]}`}
                  >
                    {t.status}
                  </p>
                )}
              </div>
              {user?.role === "admin" && (
                <button
                  onClick={() => handleDelete(t.id)}
                  className="mt-4 w-full px-4 py-2 rounded-lg bg-red-500/80 hover:bg-red-500 text-white text-sm font-medium transition ease-in-out cursor-pointer"
                >
                  Delete
                </button>
              )}
            </div>
          ))}
        </div>
        )}
        
      </div>
    </div>
  );
};

export default Dashboard;
