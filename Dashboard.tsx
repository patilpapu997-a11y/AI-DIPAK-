import React, { useEffect, useState } from 'react';
import { Layout } from '../components/Layout';
import { STORAGE_KEYS } from '../constants';
import { User, ImageGeneration } from '../types';
import { getUserImages } from '../services/mockBackend';
import { Link } from 'react-router-dom';
import { Plus, Download } from 'lucide-react';

export const Dashboard: React.FC = () => {
  const [user, setUser] = useState<User | null>(null);
  const [history, setHistory] = useState<ImageGeneration[]>([]);

  useEffect(() => {
    const uStr = localStorage.getItem(STORAGE_KEYS.CURRENT_USER);
    if (uStr) {
      const u = JSON.parse(uStr);
      setUser(u);
      setHistory(getUserImages(u.id));
    }
    
    const handleUpdate = () => {
         const uStrUpdate = localStorage.getItem(STORAGE_KEYS.CURRENT_USER);
         if(uStrUpdate) {
             const u = JSON.parse(uStrUpdate);
             setUser(u);
             setHistory(getUserImages(u.id));
         }
    };
    window.addEventListener('user-updated', handleUpdate);
    return () => window.removeEventListener('user-updated', handleUpdate);
  }, []);

  return (
    <Layout>
      <div className="space-y-8">
        {/* Header Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white dark:bg-gray-900 p-6 rounded-xl border border-gray-200 dark:border-gray-800 shadow-sm">
            <h3 className="text-gray-500 dark:text-gray-400 text-sm font-medium">Available Credits</h3>
            <p className="text-3xl font-bold mt-2">{user?.credits || 0}</p>
            <Link to="/pricing" className="text-sm text-blue-600 hover:underline mt-2 inline-block">Top up credits &rarr;</Link>
          </div>
          <div className="bg-white dark:bg-gray-900 p-6 rounded-xl border border-gray-200 dark:border-gray-800 shadow-sm">
            <h3 className="text-gray-500 dark:text-gray-400 text-sm font-medium">Images Generated</h3>
            <p className="text-3xl font-bold mt-2">{history.length}</p>
          </div>
          <div className="bg-gradient-to-br from-gray-900 to-gray-800 dark:from-white dark:to-gray-200 rounded-xl p-6 text-white dark:text-gray-900 flex items-center justify-between">
            <div>
              <h3 className="font-bold text-lg">Create New</h3>
              <p className="text-sm opacity-80">Generate amazing AI art now</p>
            </div>
            <Link to="/generate">
              <button className="bg-white/20 dark:bg-black/10 p-3 rounded-full hover:bg-white/30 transition-colors">
                <Plus size={24} />
              </button>
            </Link>
          </div>
        </div>

        {/* Gallery */}
        <div>
          <h2 className="text-xl font-bold mb-6">Recent Creations</h2>
          {history.length === 0 ? (
            <div className="text-center py-20 bg-white dark:bg-gray-900 rounded-xl border border-dashed border-gray-300 dark:border-gray-800">
              <p className="text-gray-500">You haven't generated any images yet.</p>
              <Link to="/generate" className="mt-4 inline-block text-blue-600 font-medium">Start Creating</Link>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {history.map((img) => (
                <div key={img.id} className="group relative rounded-xl overflow-hidden bg-gray-100 dark:bg-gray-800 aspect-square">
                  <img src={img.imageUrl} alt={img.prompt} className="w-full h-full object-cover" />
                  <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col justify-end p-4">
                    <p className="text-white text-sm line-clamp-2 mb-3">{img.prompt}</p>
                    <div className="flex items-center justify-between">
                      <span className="text-xs text-gray-300 bg-white/20 px-2 py-1 rounded">{img.size}</span>
                      <a 
                        href={img.imageUrl} 
                        download={`ai-image-${img.id}.png`}
                        className="p-2 bg-white text-black rounded-full hover:bg-gray-200 transition-colors"
                      >
                        <Download size={16} />
                      </a>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </Layout>
  );
};