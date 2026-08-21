import Login from "./pages/Login";
import { Routes, Route, Navigate } from "react-router-dom";
import Register from "./pages/Register";
import Dashboard from "./pages/Dashboard";
import { ProtectedRoute } from "./components/ProtectedRoute";
import CreateTask from "./pages/CreateTask";
import { Toaster } from "react-hot-toast";

function App() {
  return (
    <>
      <Toaster position="top-right"/>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              {" "}
              <Dashboard />{" "}
            </ProtectedRoute>
          }
        />
        <Route path="/" element={<Navigate to="/login" />} />
        <Route
          path="/dashboard/create-task"
          element={
            <ProtectedRoute>
              <CreateTask />
            </ProtectedRoute>
          }
        />
      </Routes>
    </>
  );
}

export default App;
