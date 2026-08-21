import { useState } from "react";
import { useAuth } from "../context/AuthContext";
import api from "../services/api";
import { useNavigate } from "react-router-dom";
import team from "../assets/pngegg.png";
import toast from "react-hot-toast";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [emailError, setEmailError] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const { login } = useAuth();
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  console.log("RENDER -PASSWORD ERROOR", passwordError);
  const validateLogin = () => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    let valid = true;

    if (!email.trim()) {
      setEmailError("Login error email required");
      valid = false;
    } else if (!emailRegex.test(email.trim())) {
      setEmailError("Login error invalid email");
      valid = false;
    }

    if (!password) {
      setPasswordError("Login error password required");
      valid = false;
    }
    return valid;
  };

  const handleLogin = async () => {
    setPasswordError("");
    console.log("BUTTON CLICKED");
    if (!validateLogin()) return;
    setLoading(true);
    try {
      const payload = {
        email: email.trim().toLowerCase(),
        password: password,
      };
      // console.log('Sending payload:', JSON.stringify(payload));
      const response = await api.post("/auth/login", payload);
      login(response.data.user, response.data.access_token);
      toast.success("Successfully logged in!");
      setTimeout(() => {
        navigate("/dashboard");
      }, 100);
    } catch (error: any) {
      const msg = error.response?.data?.message || "Login failed";
      toast.error(msg);
      setPasswordError(msg);
    } finally {
      setLoading(false);
    }
  };
  return (
    <>
      <div className="min-h-screen flex  items-center gap-10 justify-center bg-linear-to-bl from-violet-500 to-fuchsia-600">
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
              Welcome Back
            </h1>

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
              type="button"
              onClick={handleLogin}
              disabled={loading}
              className="w-full bg-white/80 hover:bg-white text-violet-800 font-semibold py-2 rounded-lg transition disabled:opacity-50 cursor-pointer"
            >
              {loading ? "Logging in..." : "Login"}
            </button>
            <p className="text-center text-white/80 text-sm mt-4">
              Don't have an account?{" "}
              <button
                type="button"
                onClick={() => navigate("/register")}
                className="text-white font-semibold underline hover:text-white/90 cursor-pointer"
              >
                Sign up
              </button>
            </p>
          </div>
        </div>
      </div>
    </>
  );
};

export default Login;
