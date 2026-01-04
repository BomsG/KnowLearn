
import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { User } from '../types';
import { storageService } from '../services/storage';
import { BrainCircuit, Mail, Lock, ArrowRight, User as UserIcon, AlertCircle } from 'lucide-react';

interface SignupPageProps {
  onSignup: (user: User) => void;
}

const SignupPage: React.FC<SignupPageProps> = ({ onSignup }) => {
  const [email, setEmail] = useState('');
  const [name, setName] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    const newUser: User = {
      id: Math.random().toString(36).substr(2, 9),
      email,
      name,
    };

    const success = storageService.registerUser(newUser, password);
    
    if (success) {
      onSignup(newUser);
      navigate('/dashboard');
    } else {
      setError('An account with this email already exists.');
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
              <BrainCircuit className="text-indigo-600 w-8 h-8" />
            </div>
            <span className="text-3xl font-black text-white tracking-tighter">knowLearn</span>
          </div>
          <h2 className="text-6xl font-black text-white leading-tight mb-8">
            Create your <br/>educator <br/>profile.
          </h2>
          <p className="text-indigo-100 text-xl max-w-md font-medium">
            Start building intelligent assessments in less than a minute.
          </p>
        </div>
      </div>

      <div className="flex-1 flex items-center justify-center p-8 lg:p-24 bg-white">
        <div className="max-w-md w-full">
          <div className="mb-12">
            <h2 className="text-4xl font-black text-gray-900 mb-3 tracking-tight">Start for free</h2>
            <p className="text-gray-500 font-medium">Join our community of world-class educators.</p>
          </div>

          {error && (
            <div className="mb-6 p-4 bg-red-50 border-l-4 border-red-500 rounded-r-xl flex items-start gap-3">
              <AlertCircle className="w-5 h-5 text-red-500 shrink-0 mt-0.5" />
              <p className="text-sm font-bold text-red-700">{error}</p>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <label className="text-sm font-bold text-gray-700 uppercase tracking-widest ml-1">Full Name</label>
              <div className="relative group">
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full px-6 py-4 bg-gray-50 border-2 border-transparent rounded-[20px] focus:bg-white focus:border-indigo-600 outline-none transition-all pl-14 text-gray-900 font-medium shadow-sm"
                  placeholder="Prof. Alice Smith"
                />
                <div className="absolute left-5 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-indigo-600 transition-colors">
                  <UserIcon className="w-5 h-5" />
                </div>
              </div>
            </div>
            <div className="space-y-2">
              <label className="text-sm font-bold text-gray-700 uppercase tracking-widest ml-1">Email Address</label>
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
                  <Mail className="w-5 h-5" />
                </div>
              </div>
            </div>
            <div className="space-y-2">
              <label className="text-sm font-bold text-gray-700 uppercase tracking-widest ml-1">Password</label>
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
              Create Account <ArrowRight className="w-6 h-6" />
            </button>
          </form>

          <div className="mt-10 pt-10 border-t border-gray-100">
            <Link
              to="/login"
              className="block w-full text-center text-gray-500 font-bold hover:text-indigo-600 transition-colors"
            >
              Already have an account? Sign In
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SignupPage;
