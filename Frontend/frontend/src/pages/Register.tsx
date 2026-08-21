import { useState } from "react";
import api from "../services/api";
import { useNavigate } from "react-router-dom";

import team from "../assets/pngegg.png";
import toast from "react-hot-toast";

const Register = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");

  const [nameError, setNameError] = useState("");
  const [emailError, setEmailError] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const validateRegistration = () => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    let valid = true;

    if (!name.trim()) {
      setNameError("SignUp error name required");
      valid = false;
    }

    if (!email.trim()) {
      setEmailError("Error email required");
      valid = false;
    } else if (!emailRegex.test(email.trim())) {
      setEmailError("Inavlid email");
      valid = false;
    }

    if (password.length < 8) {
      setPasswordError("SignUp error password length should be minimum 8");
      valid = false;
    }
    return valid;
  };

  const handleRegistration = async () => {
    if (!validateRegistration()) return;
    setLoading(true);
    try {
      const payload = {
        name: name.trim(),
        email: email.trim().toLowerCase(),
        password: password,
      };
      const response = await api.post("auth/register", payload);
      if (response.status === 201) {
        toast.success("Registered successfully!");
        navigate("/login");
      }
    } catch (error: any) {
      setPasswordError(error.response?.data?.message || "Registartion failed");
    } finally {
      setLoading(false);
    }
  };
  return (
    <>
      <div className="min-h-screen flex items-center justify-center bg-linear-to-bl from-violet-500 to-fuchsia-600">
        <div className="hidden lg:flex w-1/4 items-center justify-center">
          <img
            src={team}
            alt="App illustration"
            className="w-75 h-full object-cover"
          />
        </div>
        <div className="w-full lg:w-1/2 flex flex-col items-center justify-center p-6">
          <div className="overflow-hidden mb-8">
            <h2 className="text-6xl md:text-3xl sm:text-2xl font-semibold text-white whitespace-nowrap overflow-hidden border-r-4 border-white animate-typing">
              Manage your team's tasks, effortlessly.
            </h2>
          </div>
          <div className="backdrop-blur-lg bg-white/20 border border-white/30 rounded-2xl shadow-xl p-8 w-full max-w-sm">
            <h1 className="text-2xl font-bold text-white text-center mb-6">
              Welcome Aboard
            </h1>

            <div className="mb-4">
              <input
                type="name"
                placeholder="Name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full px-4 py-2 rounded-lg bg-white/40 placeholder-gray-700 text-gray-900 outline-none focus:ring-2 focus:ring-white"
              />
              {nameError && (
                <p className="text-red-800 text-sm mt-1">{nameError}</p>
              )}
            </div>
            <div className="mb-4">
              <input
                type="email"
                placeholder="Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-4 py-2 rounded-lg bg-white/40 placeholder-gray-700 text-gray-900 outline-none focus:ring-2 focus:ring-white"
              />
              {emailError && (
                <p className="text-red-800 text-sm mt-1">{emailError}</p>
              )}
            </div>

            <div className="mb-6">
              <input
                type="password"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-4 py-2 rounded-lg bg-white/40 placeholder-gray-700 text-gray-900 outline-none focus:ring-2 focus:ring-white"
              />
              {passwordError && (
                <p className="text-red-800 text-sm mt-1">{passwordError}</p>
              )}
            </div>

            <button
              onClick={handleRegistration}
              disabled={loading}
              className="w-full bg-white/80 hover:bg-white text-violet-800 font-semibold py-2 rounded-lg transition disabled:opacity-50"
            >
              {loading ? "Signinning up..." : "Registartion"}
            </button>
            <p className="text-center text-white/80 text-sm mt-4">
              Already have an account?{" "}
              <button
                type="button"
                onClick={() => navigate("/login")}
                className="text-white font-semibold underline hover:text-white/90 cursor-pointer"
              >
                Login
              </button>
            </p>
          </div>
        </div>
      </div>
    </>
  );
};

export default Register;
