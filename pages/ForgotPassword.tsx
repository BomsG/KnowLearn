
import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { BrainCircuit, Mail, ArrowLeft, Send, CheckCircle, Lock, AlertCircle } from 'lucide-react';
import { storageService } from '../services/storage';

const ForgotPasswordPage: React.FC = () => {
  const [email, setEmail] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [step, setStep] = useState<'email' | 'reset' | 'success'>('email');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleEmailSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    const users = storageService.getStoredUsers();
    const exists = users.some(u => u.user.email === email);
    
    if (exists) {
      setStep('reset');
    } else {
      setError('No account found with this email address.');
    }
  };

  const handleResetSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (newPassword.length < 6) {
      return setError('Password must be at least 6 characters.');
    }
    const success = storageService.resetPassword(email, newPassword);
    if (success) {
      setStep('success');
    } else {
      setError('Something went wrong. Please try again.');
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-6">
      <div className="max-w-md w-full bg-white rounded-[48px] shadow-2xl p-12 border border-gray-100">
        <div className="flex justify-center mb-8">
          <div className="bg-indigo-600 p-3 rounded-2xl shadow-lg">
            <BrainCircuit className="text-white w-8 h-8" />
          </div>
        </div>

        {step === 'email' && (
          <>
            <div className="text-center mb-10">
              <h2 className="text-3xl font-black text-gray-900 mb-3 tracking-tight">Recover Account</h2>
              <p className="text-gray-500 font-medium leading-relaxed">
                Enter your email to verify your identity.
              </p>
            </div>

            {error && (
              <div className="mb-6 p-4 bg-red-50 border-l-4 border-red-500 rounded-r-xl flex items-start gap-3">
                <AlertCircle className="w-5 h-5 text-red-500 shrink-0 mt-0.5" />
                <p className="text-sm font-bold text-red-700">{error}</p>
              </div>
            )}

            <form onSubmit={handleEmailSubmit} className="space-y-6">
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

              <button
                type="submit"
                className="w-full py-5 bg-indigo-600 text-white rounded-[24px] font-black text-xl hover:bg-indigo-700 transition-all shadow-xl shadow-indigo-100 flex items-center justify-center gap-3"
              >
                Verify Email <Send className="w-5 h-5" />
              </button>
            </form>
          </>
        )}

        {step === 'reset' && (
          <>
            <div className="text-center mb-10">
              <h2 className="text-3xl font-black text-gray-900 mb-3 tracking-tight">New Password</h2>
              <p className="text-gray-500 font-medium leading-relaxed">
                Email verified! Set a new password for <span className="font-bold text-gray-900">{email}</span>.
              </p>
            </div>

            {error && (
              <div className="mb-6 p-4 bg-red-50 border-l-4 border-red-500 rounded-r-xl flex items-start gap-3">
                <AlertCircle className="w-5 h-5 text-red-500 shrink-0 mt-0.5" />
                <p className="text-sm font-bold text-red-700">{error}</p>
              </div>
            )}

            <form onSubmit={handleResetSubmit} className="space-y-6">
              <div className="space-y-2">
                <label className="text-sm font-bold text-gray-700 uppercase tracking-widest ml-1">New Password</label>
                <div className="relative group">
                  <input
                    type="password"
                    required
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
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
                Reset Password <Send className="w-5 h-5" />
              </button>
            </form>
          </>
        )}

        {step === 'success' && (
          <div className="text-center animate-fade-in">
            <div className="bg-green-50 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-8">
              <CheckCircle className="w-10 h-10 text-green-500" />
            </div>
            <h2 className="text-3xl font-black text-gray-900 mb-4">Password Reset!</h2>
            <p className="text-gray-500 mb-10 leading-relaxed font-medium">
              Your password has been successfully updated. You can now log in with your new credentials.
            </p>
            <button
              onClick={() => navigate('/login')}
              className="w-full py-5 bg-indigo-600 text-white rounded-[24px] font-black text-xl hover:bg-indigo-700 transition-all shadow-xl"
            >
              Go to Login
            </button>
          </div>
        )}

        <div className="mt-12 pt-8 border-t border-gray-100">
          <Link
            to="/login"
            className="flex items-center justify-center gap-2 text-gray-400 font-bold hover:text-indigo-600 transition-all group"
          >
            <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" /> Back to Login
          </Link>
        </div>
      </div>
    </div>
  );
};

export default ForgotPasswordPage;
