'use client';

import React from 'react';
import Link from 'next/link';
import { useAuth } from '../contexts/AuthContext';

const Header: React.FC = () => {
  const { user, logout } = useAuth();

  return (
    <header className="backdrop-blur-md bg-glass-medium border-b border-outline-default">
      <div className="container mx-auto flex justify-between items-center p-4">
        <Link href="/">
          <span className="text-2xl font-bold cursor-pointer hover:text-white/80 transition-colors">
            GiveApp
          </span>
        </Link>
        <nav>
          {user ? (
            <div className="flex items-center space-x-4">
              <span>{user.username}</span>
              {user.profilePicture && (
                <img
                  src={user.profilePicture}
                  alt="Profile"
                  className="w-8 h-8 rounded-full border border-outline-default"
                />
              )}
              <button
                onClick={logout}
                className="backdrop-blur-xl bg-glass-light px-4 py-2 rounded-lg 
                border border-outline-default hover:bg-glass-heavy 
                transition-all duration-300 hover:shadow-glass-hover
                shadow-glass"
              >
                Logout
              </button>
            </div>
          ) : (
            <div className="space-x-4">
              <Link href="/login">
                <span className="backdrop-blur-sm bg-glass-light px-4 py-2 rounded-lg 
                              border border-outline-default hover:bg-glass-heavy 
                              transition-all duration-300 hover:shadow-[0_0_15px_rgba(255,255,255,0.1)]
                              cursor-pointer">
                  Login
                </span>
              </Link>
              <Link href="/register">
                <span className="backdrop-blur-sm bg-glass-light px-4 py-2 rounded-lg 
                              border border-outline-default hover:bg-glass-heavy 
                              transition-all duration-300 hover:shadow-[0_0_15px_rgba(255,255,255,0.1)]
                              cursor-pointer">
                  Register
                </span>
              </Link>
            </div>
          )}
        </nav>
      </div>
    </header>
  );
};
export default Header;