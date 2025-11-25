import React, { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { User, UserRole } from '../types';
import { STORAGE_KEYS, APP_NAME } from '../constants';
import { 
  LayoutDashboard, 
  Image as ImageIcon, 
  CreditCard, 
  LogOut, 
  ShieldCheck, 
  Menu, 
  X,
  User as UserIcon
} from 'lucide-react';

interface LayoutProps {
  children: React.ReactNode;
}

export const Layout: React.FC<LayoutProps> = ({ children }) => {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    const userStr = localStorage.getItem(STORAGE_KEYS.CURRENT_USER);
    if (!userStr) {
      navigate('/login');
      return;
    }
    setCurrentUser(JSON.parse(userStr));
    
    // Listen for storage changes (updates to credits)
    const handleStorageChange = () => {
       const updatedUser = localStorage.getItem(STORAGE_KEYS.CURRENT_USER);
       if (updatedUser) setCurrentUser(JSON.parse(updatedUser));
    };
    
    window.addEventListener('storage', handleStorageChange);
    // Also simulate a custom event for local tab updates
    window.addEventListener('user-updated', handleStorageChange);

    return () => {
        window.removeEventListener('storage', handleStorageChange);
        window.removeEventListener('user-updated', handleStorageChange);
    };
  }, [navigate]);

  const handleLogout = () => {
    localStorage.removeItem(STORAGE_KEYS.CURRENT_USER);
    navigate('/');
  };

  const navItems = [
    { label: 'Dashboard', path: '/dashboard', icon: LayoutDashboard },
    { label: 'Generate', path: '/generate', icon: ImageIcon },
    { label: 'Buy Credits', path: '/pricing', icon: CreditCard },
  ];

  if (currentUser?.role === UserRole.ADMIN) {
    navItems.push({ label: 'Admin Panel', path: '/admin', icon: ShieldCheck });
  }

  const isActive = (path: string) => location.pathname === path;

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950 text-gray-900 dark:text-gray-100 flex">
      {/* Mobile Sidebar Backdrop */}
      {isSidebarOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-40 md:hidden"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside className={`
        fixed md:sticky top-0 left-0 z-50 h-screen w-64 bg-white dark:bg-gray-900 border-r border-gray-200 dark:border-gray-800 transition-transform duration-300 ease-in-out
        ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'}
      `}>
        <div className="p-6 border-b border-gray-200 dark:border-gray-800 flex items-center justify-between">
          <Link to="/" className="text-xl font-bold tracking-tight">{APP_NAME}</Link>
          <button onClick={() => setIsSidebarOpen(false)} className="md:hidden">
            <X size={24} />
          </button>
        </div>

        <nav className="p-4 space-y-2">
          {navItems.map((item) => (
            <Link
              key={item.path}
              to={item.path}
              onClick={() => setIsSidebarOpen(false)}
              className={`flex items-center space-x-3 px-4 py-3 rounded-lg transition-colors ${
                isActive(item.path) 
                  ? 'bg-gray-900 text-white dark:bg-white dark:text-gray-900' 
                  : 'hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-700 dark:text-gray-300'
              }`}
            >
              <item.icon size={20} />
              <span>{item.label}</span>
            </Link>
          ))}
        </nav>

        <div className="absolute bottom-0 left-0 w-full p-4 border-t border-gray-200 dark:border-gray-800">
           <div className="flex items-center space-x-3 mb-4 px-2">
             <div className="bg-gray-200 dark:bg-gray-700 p-2 rounded-full">
               <UserIcon size={18} />
             </div>
             <div className="overflow-hidden">
               <p className="text-sm font-medium truncate">{currentUser?.name}</p>
               <p className="text-xs text-gray-500 dark:text-gray-400">{currentUser?.credits} Credits</p>
             </div>
           </div>
           <button 
             onClick={handleLogout}
             className="flex items-center space-x-2 w-full px-4 py-2 text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors"
           >
             <LogOut size={18} />
             <span>Logout</span>
           </button>
        </div>
      </aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col min-h-screen min-w-0">
        <header className="md:hidden h-16 border-b border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 flex items-center justify-between px-4 sticky top-0 z-30">
          <span className="font-bold">{APP_NAME}</span>
          <button onClick={() => setIsSidebarOpen(true)}>
            <Menu size={24} />
          </button>
        </header>

        <main className="flex-1 p-4 md:p-8 overflow-y-auto">
          {children}
        </main>
      </div>
    </div>
  );
};