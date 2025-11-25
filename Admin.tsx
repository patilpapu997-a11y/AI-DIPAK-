import React, { useEffect, useState } from 'react';
import { Layout } from '../components/Layout';
import { User, Payment, PaymentStatus, UserRole } from '../types';
import { getUsers, getPayments, approvePayment, updateUserCredits, getAnalytics } from '../services/mockBackend';
import { STORAGE_KEYS, ADMIN_EMAIL } from '../constants';
import { useNavigate } from 'react-router-dom';
import { Button } from '../components/Button';
import { Check, X } from 'lucide-react';

export const Admin: React.FC = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [payments, setPayments] = useState<Payment[]>([]);
  const [analytics, setAnalytics] = useState<any>({});
  const navigate = useNavigate();

  useEffect(() => {
    const uStr = localStorage.getItem(STORAGE_KEYS.CURRENT_USER);
    if (!uStr) {
        navigate('/login');
        return;
    }
    const user = JSON.parse(uStr);
    if (user.role !== UserRole.ADMIN && user.email !== ADMIN_EMAIL) {
        navigate('/dashboard');
        return;
    }

    refreshData();
  }, [navigate]);

  const refreshData = () => {
    setUsers(getUsers());
    setPayments(getPayments());
    setAnalytics(getAnalytics());
  };

  const handleApprovePayment = (id: string) => {
    approvePayment(id);
    refreshData();
    alert("Payment Approved");
  };

  const handleAddCredits = (userId: string) => {
    const amount = prompt("Enter credits to add:", "10");
    if (amount) {
        updateUserCredits(userId, parseInt(amount), 'add');
        refreshData();
    }
  };

  return (
    <Layout>
      <div className="space-y-8">
        <h1 className="text-3xl font-bold">Admin Panel</h1>

        {/* Analytics Cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="bg-white dark:bg-gray-900 p-4 rounded-lg border border-gray-200 dark:border-gray-800">
                <p className="text-sm text-gray-500">Total Users</p>
                <p className="text-2xl font-bold">{analytics.totalUsers || 0}</p>
            </div>
            <div className="bg-white dark:bg-gray-900 p-4 rounded-lg border border-gray-200 dark:border-gray-800">
                <p className="text-sm text-gray-500">Total Revenue</p>
                <p className="text-2xl font-bold">₹{analytics.totalRevenue || 0}</p>
            </div>
             <div className="bg-white dark:bg-gray-900 p-4 rounded-lg border border-gray-200 dark:border-gray-800">
                <p className="text-sm text-gray-500">Total Images</p>
                <p className="text-2xl font-bold">{analytics.totalImages || 0}</p>
            </div>
            <div className="bg-white dark:bg-gray-900 p-4 rounded-lg border border-gray-200 dark:border-gray-800">
                <p className="text-sm text-gray-500">Credits Consumed</p>
                <p className="text-2xl font-bold">{analytics.creditsConsumed || 0}</p>
            </div>
        </div>

        {/* Pending Payments */}
        <div className="bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-800 overflow-hidden">
            <div className="p-6 border-b border-gray-200 dark:border-gray-800">
                <h2 className="text-lg font-bold">Pending Manual Payments</h2>
            </div>
            <div className="overflow-x-auto">
                <table className="w-full text-sm text-left">
                    <thead className="text-gray-500 bg-gray-50 dark:bg-gray-800/50">
                        <tr>
                            <th className="px-6 py-3">User ID</th>
                            <th className="px-6 py-3">Amount</th>
                            <th className="px-6 py-3">Tx ID</th>
                            <th className="px-6 py-3">Date</th>
                            <th className="px-6 py-3">Action</th>
                        </tr>
                    </thead>
                    <tbody>
                        {payments.filter(p => p.status === PaymentStatus.PENDING).length === 0 && (
                            <tr><td colSpan={5} className="px-6 py-4 text-center text-gray-500">No pending payments</td></tr>
                        )}
                        {payments.filter(p => p.status === PaymentStatus.PENDING).map(p => (
                            <tr key={p.id} className="border-b border-gray-100 dark:border-gray-800">
                                <td className="px-6 py-4 font-mono">{p.userId.substring(0,8)}...</td>
                                <td className="px-6 py-4">₹{p.amount}</td>
                                <td className="px-6 py-4">{p.transactionId}</td>
                                <td className="px-6 py-4">{new Date(p.createdAt).toLocaleDateString()}</td>
                                <td className="px-6 py-4">
                                    <Button size="sm" onClick={() => handleApprovePayment(p.id)} className="bg-green-600 hover:bg-green-700 text-white">
                                        <Check size={16} className="mr-1" /> Approve
                                    </Button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>

        {/* Users List */}
        <div className="bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-800 overflow-hidden">
            <div className="p-6 border-b border-gray-200 dark:border-gray-800">
                <h2 className="text-lg font-bold">All Users</h2>
            </div>
            <div className="overflow-x-auto">
                <table className="w-full text-sm text-left">
                     <thead className="text-gray-500 bg-gray-50 dark:bg-gray-800/50">
                        <tr>
                            <th className="px-6 py-3">Name</th>
                            <th className="px-6 py-3">Email</th>
                            <th className="px-6 py-3">Credits</th>
                            <th className="px-6 py-3">Joined</th>
                            <th className="px-6 py-3">Manage</th>
                        </tr>
                    </thead>
                    <tbody>
                        {users.map(u => (
                            <tr key={u.id} className="border-b border-gray-100 dark:border-gray-800">
                                <td className="px-6 py-4 font-medium">{u.name}</td>
                                <td className="px-6 py-4">{u.email}</td>
                                <td className="px-6 py-4">{u.credits}</td>
                                <td className="px-6 py-4">{new Date(u.createdAt).toLocaleDateString()}</td>
                                <td className="px-6 py-4">
                                    <Button size="sm" variant="outline" onClick={() => handleAddCredits(u.id)}>Modify Credits</Button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
      </div>
    </Layout>
  );
};