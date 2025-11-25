import React, { useState } from 'react';
import { Layout } from '../components/Layout';
import { Button } from '../components/Button';
import { PLANS, UPI_ID, STORAGE_KEYS } from '../constants';
import { User, PaymentMethod } from '../types';
import { createPayment } from '../services/mockBackend';
import { Check, QrCode } from 'lucide-react';

export const Pricing: React.FC = () => {
  const [selectedPlan, setSelectedPlan] = useState<string | null>(null);
  const [showUpiModal, setShowUpiModal] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const user: User = JSON.parse(localStorage.getItem(STORAGE_KEYS.CURRENT_USER) || '{}');

  const handleRazorpay = async (planId: string) => {
    const plan = PLANS.find(p => p.id === planId);
    if (!plan) return;
    
    setIsProcessing(true);
    // Simulate Razorpay
    setTimeout(() => {
       createPayment(user.id, plan.price, plan.credits, PaymentMethod.RAZORPAY, `pay_${Math.random()}`);
       alert(`Payment Successful! ${plan.credits} credits added.`);
       window.dispatchEvent(new Event('user-updated'));
       setIsProcessing(false);
       setSelectedPlan(null);
    }, 1500);
  };

  const handleManualUpi = () => {
    if (!selectedPlan) return;
    setShowUpiModal(true);
  };

  const submitManualUpi = (e: React.FormEvent) => {
    e.preventDefault();
    const plan = PLANS.find(p => p.id === selectedPlan);
    if (!plan) return;

    setIsProcessing(true);
    setTimeout(() => {
        createPayment(user.id, plan.price, plan.credits, PaymentMethod.UPI_MANUAL, `upi_${Math.random()}`);
        alert("Payment submitted for approval. Admin will verify shortly.");
        setIsProcessing(false);
        setShowUpiModal(false);
        setSelectedPlan(null);
    }, 1000);
  };

  return (
    <Layout>
      <div className="max-w-5xl mx-auto text-center space-y-12">
        <div>
          <h1 className="text-4xl font-bold mb-4">Buy Credits</h1>
          <p className="text-gray-500 dark:text-gray-400">Choose a package that suits your creative needs.</p>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {PLANS.map((plan) => (
            <div 
              key={plan.id}
              className={`relative bg-white dark:bg-gray-900 p-8 rounded-2xl border transition-all duration-300 flex flex-col ${
                selectedPlan === plan.id 
                ? 'border-gray-900 dark:border-white shadow-xl scale-105 z-10' 
                : 'border-gray-200 dark:border-gray-800 hover:border-gray-400'
              }`}
            >
              {plan.id === 'pro' && (
                <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-gray-900 text-white dark:bg-white dark:text-gray-900 px-3 py-1 text-xs font-bold rounded-full uppercase tracking-wide">
                  Most Popular
                </div>
              )}
              <h3 className="text-xl font-bold">{plan.name}</h3>
              <div className="my-6">
                <span className="text-4xl font-bold">₹{plan.price}</span>
              </div>
              <p className="text-gray-500 dark:text-gray-400 mb-6">{plan.description}</p>
              
              <ul className="space-y-3 mb-8 text-left flex-1">
                <li className="flex items-center space-x-2">
                  <Check size={18} className="text-green-500" />
                  <span>{plan.credits} Credits</span>
                </li>
                <li className="flex items-center space-x-2">
                    <Check size={18} className="text-green-500" />
                    <span>~{Math.floor(plan.credits / 2)} Images</span>
                </li>
                <li className="flex items-center space-x-2">
                  <Check size={18} className="text-green-500" />
                  <span>No Expiry</span>
                </li>
              </ul>

              <Button 
                variant={selectedPlan === plan.id ? 'primary' : 'outline'}
                onClick={() => setSelectedPlan(plan.id)}
                className="w-full"
              >
                {selectedPlan === plan.id ? 'Selected' : 'Select Plan'}
              </Button>
            </div>
          ))}
        </div>

        {selectedPlan && (
          <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 p-8 rounded-2xl max-w-xl mx-auto shadow-2xl animate-fade-in-up">
            <h3 className="text-xl font-bold mb-6">Complete Payment</h3>
            <div className="space-y-4">
               <Button 
                 onClick={() => handleRazorpay(selectedPlan)} 
                 isLoading={isProcessing}
                 className="w-full bg-blue-600 hover:bg-blue-700 text-white"
               >
                 Pay via Razorpay
               </Button>
               <div className="relative flex py-2 items-center">
                  <div className="flex-grow border-t border-gray-300 dark:border-gray-700"></div>
                  <span className="flex-shrink-0 mx-4 text-gray-400">OR</span>
                  <div className="flex-grow border-t border-gray-300 dark:border-gray-700"></div>
               </div>
               <Button 
                  variant="outline"
                  onClick={handleManualUpi}
                  className="w-full"
               >
                 Manual UPI Transfer
               </Button>
            </div>
          </div>
        )}

        {/* Manual UPI Modal */}
        {showUpiModal && (
          <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4">
             <div className="bg-white dark:bg-gray-900 rounded-2xl max-w-md w-full p-6 shadow-2xl">
                <h3 className="text-xl font-bold mb-4">Manual UPI Payment</h3>
                <div className="bg-gray-100 dark:bg-gray-800 p-4 rounded-lg mb-4 text-center">
                    <QrCode className="mx-auto mb-2 h-12 w-12" />
                    <p className="font-mono text-lg font-bold">{UPI_ID}</p>
                    <p className="text-xs text-gray-500">Scan or copy UPI ID to pay</p>
                </div>
                <form onSubmit={submitManualUpi} className="space-y-4">
                   <div>
                       <label className="block text-sm font-medium mb-1">Transaction ID / UTR</label>
                       <input 
                         required
                         type="text" 
                         className="w-full px-3 py-2 bg-transparent border border-gray-300 dark:border-gray-700 rounded-lg"
                         placeholder="e.g. 123456789012"
                       />
                   </div>
                   <div>
                       <label className="block text-sm font-medium mb-1">Upload Screenshot</label>
                       <input type="file" required className="w-full text-sm" />
                   </div>
                   <div className="flex gap-3 mt-6">
                      <Button type="button" variant="ghost" onClick={() => setShowUpiModal(false)} className="flex-1">Cancel</Button>
                      <Button type="submit" isLoading={isProcessing} className="flex-1">Submit</Button>
                   </div>
                </form>
             </div>
          </div>
        )}
      </div>
    </Layout>
  );
};