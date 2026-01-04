
import React, { useState } from 'react';
import { User } from '../types';
import { User as UserIcon, Mail, Camera, Save, ArrowLeft, CheckCircle } from 'lucide-react';
import { Link } from 'react-router-dom';

interface ProfilePageProps {
  user: User;
  onUpdate: (user: User) => void;
}

const ProfilePage: React.FC<ProfilePageProps> = ({ user, onUpdate }) => {
  const [name, setName] = useState(user.name);
  const [email, setEmail] = useState(user.email);
  const [avatar, setAvatar] = useState(user.avatar || '');
  const [saved, setSaved] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onUpdate({ ...user, name, email, avatar });
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setAvatar(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="bg-gray-50 min-h-screen pt-12 pb-24 px-6">
      <div className="max-w-3xl mx-auto">
        <Link to="/dashboard" className="inline-flex items-center gap-2 text-gray-400 hover:text-indigo-600 font-bold mb-10 transition-colors">
          <ArrowLeft className="w-5 h-5" /> Back to Dashboard
        </Link>

        <div className="bg-white rounded-[48px] shadow-2xl border border-gray-100 overflow-hidden">
          <div className="bg-indigo-600 h-32 relative">
            <div className="absolute top-0 right-0 p-8">
              <span className="text-white/30 text-8xl font-black uppercase tracking-tighter select-none">Profile</span>
            </div>
          </div>
          
          <div className="px-12 pb-12">
            <div className="relative -mt-16 mb-12 flex justify-center">
              <div className="relative group">
                <div className="w-40 h-40 rounded-[40px] bg-white p-2 shadow-2xl overflow-hidden border border-gray-100">
                  {avatar ? (
                    <img src={avatar} className="w-full h-full object-cover rounded-[32px]" alt="Profile" />
                  ) : (
                    <div className="w-full h-full bg-indigo-50 rounded-[32px] flex items-center justify-center text-indigo-200">
                      <UserIcon className="w-20 h-20" />
                    </div>
                  )}
                </div>
                <label className="absolute bottom-4 right-4 bg-indigo-600 text-white p-3 rounded-2xl shadow-xl cursor-pointer hover:bg-indigo-700 hover:scale-110 transition-all group-hover:rotate-6">
                  <Camera className="w-5 h-5" />
                  <input type="file" className="hidden" accept="image/*" onChange={handleAvatarChange} />
                </label>
              </div>
            </div>

            <div className="max-w-xl mx-auto">
              <div className="text-center mb-12">
                <h1 className="text-3xl font-black text-gray-900 mb-2">Account Settings</h1>
                <p className="text-gray-500 font-medium">Manage your personal information and educator profile.</p>
              </div>

              <form onSubmit={handleSubmit} className="space-y-8">
                <div className="space-y-2">
                  <label className="text-xs font-black text-gray-400 uppercase tracking-[0.2em] ml-2">Full Name</label>
                  <div className="relative group">
                    <input 
                      type="text" 
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      className="w-full px-8 py-5 bg-gray-50 border-2 border-transparent rounded-[24px] focus:bg-white focus:border-indigo-600 outline-none transition-all pl-16 text-gray-900 font-bold"
                      placeholder="Your Name"
                    />
                    <div className="absolute left-6 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-indigo-600 transition-colors">
                      <UserIcon className="w-6 h-6" />
                    </div>
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-xs font-black text-gray-400 uppercase tracking-[0.2em] ml-2">Email Address</label>
                  <div className="relative group">
                    <input 
                      type="email" 
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="w-full px-8 py-5 bg-gray-50 border-2 border-transparent rounded-[24px] focus:bg-white focus:border-indigo-600 outline-none transition-all pl-16 text-gray-900 font-bold"
                      placeholder="name@university.edu"
                    />
                    <div className="absolute left-6 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-indigo-600 transition-colors">
                      <Mail className="w-6 h-6" />
                    </div>
                  </div>
                </div>

                <div className="pt-4">
                  <button 
                    type="submit"
                    className={`w-full py-5 rounded-[24px] font-black text-xl flex items-center justify-center gap-3 transition-all shadow-xl ${
                      saved ? 'bg-green-500 text-white shadow-green-100' : 'bg-indigo-600 text-white shadow-indigo-100 hover:bg-indigo-700 hover:-translate-y-1'
                    }`}
                  >
                    {saved ? (
                      <><CheckCircle className="w-6 h-6" /> Saved!</>
                    ) : (
                      <><Save className="w-6 h-6" /> Save Profile</>
                    )}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;
