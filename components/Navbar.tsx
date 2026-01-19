'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { UserButton, useUser } from '@clerk/nextjs';
import { Menu, X } from 'lucide-react';

const Navbar = () => {
  const { isSignedIn } = useUser();
  const [isOpen, setIsOpen] = useState(false);

  return (
    <nav className="fixed top-0 left-0 w-full z-50 bg-white shadow-md border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex items-center justify-between">
        {/* Brand */}
        <Link
          href="/"
          className="text-2xl font-extrabold text-black hover:text-gray-700 transition duration-200"
        >
          DevClash
        </Link>

        {/* Desktop Menu */}
        <div className="hidden md:flex space-x-6 text-black font-medium text-sm">
          <Link href="/contest-page" className="hover:text-gray-600 transition duration-200">
            Contests
          </Link>
          <Link href="/problems" className="hover:text-gray-600 transition duration-200">
            Problems
          </Link>
        </div>

        {/* Right side - Auth / User */}
        <div className="hidden md:flex items-center space-x-4">
          {isSignedIn ? (
            <UserButton afterSignOutUrl="/" />
          ) : (
            <Link
              href="/sign-in"
              className="px-4 py-2 bg-black text-white rounded-md hover:bg-gray-800 transition duration-200 text-sm"
            >
              Login
            </Link>
          )}
        </div>

        {/* Mobile Toggle */}
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="md:hidden text-black focus:outline-none"
        >
          {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </div>

      {/* Mobile Menu */}
      {isOpen && (
        <div className="md:hidden px-4 pb-4 space-y-2 bg-white border-t border-gray-200">
          <Link href="/contest-page" className="block text-black hover:text-gray-600">
            Contests
          </Link>
          <Link href="/problems" className="block text-black hover:text-gray-600">
            Problems
          </Link>
          {isSignedIn ? (
            <div className="pt-2">
              <UserButton afterSignOutUrl="/" />
            </div>
          ) : (
            <Link
              href="/sign-in"
              className="block w-full text-center py-2 bg-black text-white rounded-md hover:bg-gray-800 transition"
            >
              Login
            </Link>
          )}
        </div>
      )}
    </nav>
  );
};

export default Navbar;
