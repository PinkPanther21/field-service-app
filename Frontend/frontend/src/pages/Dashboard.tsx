import { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext";
import type { Task } from "../types";
import api from "../services/api";
import { useNavigate } from "react-router-dom";

const Dashboard = () => {
  const { user } = useAuth();
  const [task, setTask] = useState<Task[]>([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchTask = async () => {
      try {
        const response = await api.get("/task");
        setTask(response.data);
      } catch (error) {
        console.log("Error fetching data: ", error);
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

  return (
    <div className="min-h-screen flex flex-col items-center bg-linear-to-br from-sky-300 to-sky-500 p-6">
      <h1 className="text-4xl text-center font-semibold text-white mt-6 mb-2">
        Welcome, {user?.name}
      </h1>

      <div className="w-full max-w-2xl mt-6">
        <div className="flex justify-around">
          <h2 className="text-xl font-semibold text-white mb-4">
            Task For The Day
          </h2>
          {user?.role === "admin" && (
            <button
              onClick={() => navigate("/dashboard/create-task")}
              className="text-white font-semibold"
            >
              + Create Task
            </button>
          )}
        </div>
        {task.map((t) => (
          <div
            key={t.id}
            className="w-full mt-4 rounded-2xl flex items-center justify-between px-6 py-5 bg-white/30 backdrop-blur-md border border-white/30"
          >
            <div className="flex flex-col gap-3 justify-center">
              <p className="text-xl font-semibold text-white">{t.title}</p>
              <h3 className="text-sm text-white font-bold text-shadow-black">
                {t.assignedTo.name}
              </h3>
            </div>

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
        ))}
      </div>
    </div>
  );
};

export default Dashboard;
