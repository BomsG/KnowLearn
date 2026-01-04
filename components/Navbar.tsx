
import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { User } from '../types';
import { FiPlus, FiBook, FiUser, FiLogOut } from 'react-icons/fi';
import { Button } from './UI';

interface NavbarProps {
  user: User | null;
  onLogout: () => void;
}

const Navbar: React.FC<NavbarProps> = ({ user, onLogout }) => {
  const navigate = useNavigate();

  return (
    <nav className="bg-white/80 backdrop-blur-xl px-6 md:px-12 py-4 flex justify-between items-center sticky top-0 z-50 border-b border-gray-100">
      <Link to="/" className="flex items-center gap-2">
        <span className="text-2xl font-black text-gray-900 tracking-tighter">
          know<span className="text-indigo-600">Learn</span>
        </span>
      </Link>

      <div className="flex items-center gap-4">
        {user ? (
          <div className="flex items-center gap-2 md:gap-6">
            <Link to="/dashboard" className="hidden sm:flex items-center gap-2 text-sm font-bold text-gray-700 hover:text-indigo-600 transition-colors">
              <FiBook /> Library
            </Link>
            <Button 
              onClick={() => navigate('/create')}
              size="sm"
              icon={<FiPlus />}
              className="hidden sm:flex"
            >
              Create
            </Button>
            
            <div className="h-6 w-px bg-gray-100 mx-2 hidden sm:block" />

            <Link to="/profile" className="flex items-center gap-3 group">
              <div className="w-10 h-10 rounded-2xl bg-indigo-50 border border-indigo-100 flex items-center justify-center text-indigo-600 font-black overflow-hidden group-hover:bg-indigo-600 group-hover:text-white transition-all">
                {user.avatar ? <img src={user.avatar} className="w-full h-full object-cover" /> : user.name.charAt(0)}
              </div>
            </Link>

            <button 
              onClick={() => { onLogout(); navigate('/'); }}
              className="p-2.5 text-gray-300 hover:text-red-500 hover:bg-red-50 rounded-xl transition-all"
              title="Logout"
            >
              <FiLogOut className="w-5 h-5" />
            </button>
          </div>
        ) : (
          <Button onClick={() => navigate('/login')} size="md">
            Sign In
          </Button>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
