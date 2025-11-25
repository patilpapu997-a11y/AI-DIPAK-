import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '../components/Button';
import { ArrowRight, Zap, Shield, Image as ImageIcon } from 'lucide-react';
import { APP_NAME } from '../constants';

export const Landing: React.FC = () => {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950 text-gray-900 dark:text-white font-sans">
      {/* Navbar */}
      <nav className="flex items-center justify-between px-6 py-4 max-w-7xl mx-auto">
        <div className="text-2xl font-bold tracking-tighter">{APP_NAME}</div>
        <div className="space-x-4">
          <Link to="/login" className="text-sm font-medium hover:text-gray-600 dark:hover:text-gray-300">Log in</Link>
          <Link to="/signup">
            <Button size="sm">Sign Up</Button>
          </Link>
        </div>
      </nav>

      {/* Hero */}
      <section className="py-20 px-6 text-center max-w-4xl mx-auto">
        <h1 className="text-5xl md:text-7xl font-bold mb-6 tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-gray-900 via-gray-700 to-gray-500 dark:from-white dark:via-gray-300 dark:to-gray-500">
          Turn your imagination into reality.
        </h1>
        <p className="text-xl text-gray-600 dark:text-gray-400 mb-10 max-w-2xl mx-auto">
          Generate stunning, high-quality images in seconds with our advanced AI engine. 
          No server storage. Complete privacy.
        </p>
        <Link to="/signup">
          <Button size="lg" className="shadow-xl shadow-gray-200 dark:shadow-none">
            Start Creating for Free <ArrowRight className="ml-2 h-5 w-5" />
          </Button>
        </Link>
        
        {/* Placeholder Demo Image */}
        <div className="mt-16 relative group">
           <div className="absolute -inset-1 bg-gradient-to-r from-pink-600 to-purple-600 rounded-xl blur opacity-25 group-hover:opacity-50 transition duration-1000"></div>
           <img 
             src="https://picsum.photos/1200/600" 
             alt="AI Generated Example" 
             className="relative rounded-xl shadow-2xl w-full object-cover h-[400px]"
           />
        </div>
      </section>

      {/* Features */}
      <section className="py-20 bg-white dark:bg-gray-900">
        <div className="max-w-7xl mx-auto px-6 grid md:grid-cols-3 gap-12">
          <div className="space-y-4">
            <div className="w-12 h-12 bg-gray-100 dark:bg-gray-800 rounded-lg flex items-center justify-center">
              <Zap className="h-6 w-6" />
            </div>
            <h3 className="text-xl font-bold">Lightning Fast</h3>
            <p className="text-gray-500 dark:text-gray-400">Generate high-res images in seconds using the latest Nano Banana Pro models.</p>
          </div>
          <div className="space-y-4">
            <div className="w-12 h-12 bg-gray-100 dark:bg-gray-800 rounded-lg flex items-center justify-center">
               <ImageIcon className="h-6 w-6" />
            </div>
            <h3 className="text-xl font-bold">High Quality 4K</h3>
            <p className="text-gray-500 dark:text-gray-400">Support for 1K, 2K, and 4K resolution exports for professional use.</p>
          </div>
          <div className="space-y-4">
             <div className="w-12 h-12 bg-gray-100 dark:bg-gray-800 rounded-lg flex items-center justify-center">
              <Shield className="h-6 w-6" />
            </div>
            <h3 className="text-xl font-bold">Privacy First</h3>
            <p className="text-gray-500 dark:text-gray-400">We don't store your images. What you create stays on your device.</p>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-8 text-center text-gray-500 text-sm border-t border-gray-200 dark:border-gray-800">
        © {new Date().getFullYear()} {APP_NAME}. All rights reserved.
      </footer>
    </div>
  );
};