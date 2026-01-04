import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { User } from "../types";
import { storageService } from "../services/storage";
import { FaBrain } from "react-icons/fa";
import { FiMail, FiLock, FiArrowRight, FiAlertCircle } from "react-icons/fi";

interface LoginPageProps {
  onLogin: (user: User) => void;
}

const LoginPage: React.FC<LoginPageProps> = ({ onLogin }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    const validatedUser = storageService.validateUser(email, password);

    if (validatedUser) {
      onLogin(validatedUser);
      navigate("/dashboard");
    } else {
      setError("Invalid email or password. Only registered users can sign in.");
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col md:flex-row">
      <div className="hidden lg:flex w-1/2 bg-indigo-600 p-24 flex-col justify-between relative overflow-hidden">
        <div className="absolute top-[-10%] right-[-10%] w-96 h-96 bg-indigo-400 rounded-full blur-[100px] opacity-40"></div>
        <div className="absolute bottom-[-10%] left-[-10%] w-96 h-96 bg-purple-400 rounded-full blur-[100px] opacity-40"></div>

        <div className="relative z-10">
          <div className="flex items-center gap-3 mb-16">
            <div className="bg-white p-2 rounded-xl">
              <FaBrain size={20} />
            </div>
            <span className="text-3xl font-black text-white tracking-tighter">
              knowLearn
            </span>
          </div>
          <h2 className="text-6xl font-black text-white leading-tight mb-8">
            The future of <br />
            academic assessment <br />
            starts here.
          </h2>
          <p className="text-indigo-100 text-xl max-w-md font-medium">
            Join thousands of educators leveraging AI to build smarter quizzes.
          </p>
        </div>

        <div className="relative z-10 flex items-center gap-6">
          <div className="flex -space-x-3">
            {[1, 2, 3, 4].map((i) => (
              <img
                key={i}
                className="w-12 h-12 rounded-full border-4 border-indigo-600 object-cover"
                src={`https://i.pravatar.cc/100?u=${i + 10}`}
                alt="User"
              />
            ))}
          </div>
          <p className="text-indigo-200 font-bold text-sm">
            Trusted by <br />
            top universities
          </p>
        </div>
      </div>

      <div className="flex-1 flex items-center justify-center p-8 lg:p-24 bg-white">
        <div className="max-w-md w-full">
          <div className="mb-12">
            <h2 className="text-4xl font-black text-gray-900 mb-3 tracking-tight">
              Welcome back
            </h2>
            <p className="text-gray-500 font-medium">
              Login to your dashboard to manage assessments.
            </p>
          </div>

          {error && (
            <div className="mb-6 p-4 bg-red-50 border-l-4 border-red-500 rounded-r-xl flex items-start gap-3 animate-pulse">
              <FiAlertCircle size={20} color="red" />
              <p className="text-sm font-bold text-red-700">{error}</p>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <label className="text-sm font-bold text-gray-700 uppercase tracking-widest ml-1">
                Email Address
              </label>
              <div className="relative group">
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full px-6 py-4 bg-gray-50 border-2 border-transparent rounded-[20px] focus:bg-white focus:border-indigo-600 outline-none transition-all pl-14 text-gray-900 font-medium shadow-sm"
                  placeholder="name@university.edu"
                />
                <div className="absolute left-5 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-indigo-600 transition-colors">
                  <FiMail size={20} />
                </div>
              </div>
            </div>
            <div className="space-y-2">
              <div className="flex justify-between items-center ml-1">
                <label className="text-sm font-bold text-gray-700 uppercase tracking-widest">
                  Password
                </label>
                {/* Fixed: Removed non-existent 'size' prop from Link component */}
                <Link
                  to="/forgot-password"
                  className="text-xs font-bold text-indigo-600 hover:text-indigo-700"
                >
                  Forgot?
                </Link>
              </div>
              <div className="relative group">
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full px-6 py-4 bg-gray-50 border-2 border-transparent rounded-[20px] focus:bg-white focus:border-indigo-600 outline-none transition-all pl-14 text-gray-900 font-medium shadow-sm"
                  placeholder="••••••••"
                />
                <div className="absolute left-5 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-indigo-600 transition-colors">
                  <Lock className="w-5 h-5" />
                </div>
              </div>
            </div>

            <button
              type="submit"
              className="w-full py-5 bg-indigo-600 text-white rounded-[24px] font-black text-xl hover:bg-indigo-700 transition-all shadow-xl shadow-indigo-100 flex items-center justify-center gap-3"
            >
              Sign In <FiArrowRight size={20} />
            </button>
          </form>

          <div className="mt-10 pt-10 border-t border-gray-100">
            <Link
              to="/signup"
              className="block w-full text-center text-gray-500 font-bold hover:text-indigo-600 transition-colors"
            >
              Don't have an account? Create one
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
