'use client';

import Navbar from '@/components/Navbar';
import Link from 'next/link';
import React from 'react';

const Home = () => {
  return (
    <>
      {/* <Navbar /> */}
      <main className="min-h-screen flex items-center justify-center bg-white text-black px-4">
        <div className="text-center max-w-2xl">
          <h1 className="text-4xl md:text-5xl font-bold mb-6">Welcome to DevClash</h1>
          <p className="text-lg md:text-xl text-gray-700 mb-8">
            Sharpen your coding skills with problems and contests inspired by LeetCode and Codeforces.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/problems">
              <button className="px-6 py-3 bg-black text-white rounded-xl hover:bg-gray-900 transition-all">
                Explore Problems
              </button>
            </Link>
            <Link href="/contest-page">
              <button className="px-6 py-3 border border-black text-black rounded-xl hover:bg-gray-100 transition-all">
                Join Contests
              </button>
            </Link>
          </div>
        </div>
      </main>
    </>
  );
};

export default Home;
