import React, { useState } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { Input } from '../components/Input';
import { Button } from '../components/Button';
import { loginUser, registerUser } from '../services/mockBackend';
import { STORAGE_KEYS } from '../constants';

export const Auth: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const isSignup = location.pathname === '/signup';
  
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: ''
  });
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      // Simulate network delay
      await new Promise(resolve => setTimeout(resolve, 800));

      let user;
      if (isSignup) {
        user = registerUser(formData.email, formData.password, formData.name);
      } else {
        user = loginUser(formData.email, formData.password);
      }
      
      localStorage.setItem(STORAGE_KEYS.CURRENT_USER, JSON.stringify(user));
      navigate('/dashboard');
    } catch (err: any) {
      setError(err.message || 'Something went wrong');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-950 px-4">
      <div className="max-w-md w-full space-y-8 bg-white dark:bg-gray-900 p-8 rounded-2xl shadow-xl border border-gray-100 dark:border-gray-800">
        <div className="text-center">
          <h2 className="text-3xl font-bold tracking-tight">
            {isSignup ? 'Create an account' : 'Welcome back'}
          </h2>
          <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
            {isSignup ? 'Start generating images today' : 'Continue your creative journey'}
          </p>
        </div>

        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          {isSignup && (
            <Input
              label="Full Name"
              type="text"
              required
              value={formData.name}
              onChange={e => setFormData({...formData, name: e.target.value})}
              placeholder="John Doe"
            />
          )}
          
          <Input
            label="Email address"
            type="email"
            required
            value={formData.email}
            onChange={e => setFormData({...formData, email: e.target.value})}
            placeholder="you@example.com"
          />

          <Input
            label="Password"
            type="password"
            required
            value={formData.password}
            onChange={e => setFormData({...formData, password: e.target.value})}
            placeholder="••••••••"
          />

          {error && <div className="text-red-500 text-sm text-center bg-red-50 dark:bg-red-900/20 p-2 rounded">{error}</div>}

          <Button type="submit" className="w-full" isLoading={isLoading} size="lg">
            {isSignup ? 'Sign Up' : 'Log In'}
          </Button>

          <div className="text-center text-sm">
            <span className="text-gray-500">
              {isSignup ? 'Already have an account? ' : "Don't have an account? "}
            </span>
            <Link 
              to={isSignup ? '/login' : '/signup'} 
              className="font-medium text-gray-900 dark:text-white hover:underline"
            >
              {isSignup ? 'Log in' : 'Sign up'}
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
};