'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/Button';
import { CheckCircle2, MessageSquarePlus, X, AlertCircle } from 'lucide-react';
import { requestModification, approveOrder } from '@/app/actions/orderActions';

interface OrderActionsClientProps {
  orderId: string;
  orderItemId: string;
  modificationCount: number;
  maxModifications: number;
  pdfUrl?: string | null;
  status: string;
}

export function OrderActionsClient({ 
  orderId, 
  orderItemId, 
  modificationCount, 
  maxModifications, 
  pdfUrl,
  status
}: OrderActionsClientProps) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [requestText, setRequestText] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleApprove = async () => {
    if (!confirm("Are you sure you want to approve this version? We will proceed to print it.")) return;
    setLoading(true);
    try {
      await approveOrder(orderId);
      // Wait for server action to revalidate
    } catch (err: any) {
      alert(err.message || 'Error approving order');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmitModification = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!requestText.trim()) return;
    setLoading(true);
    setError('');

    try {
      await requestModification(orderId, orderItemId, requestText);
      setIsModalOpen(false);
      setRequestText('');
    } catch (err: any) {
      setError(err.message || 'Error submitting request');
    } finally {
      setLoading(false);
    }
  };

  const isEbookReady = status === 'ebook_ready' || status === 'awaiting_customer_approval';
  const hasModificationsLeft = modificationCount < maxModifications;

  return (
    <>
      <div className="bg-white rounded-[2rem] p-8 shadow-sm border border-honey-light/50 flex flex-col items-center text-center">
        {!isEbookReady && status !== 'approved' && status !== 'completed' && status !== 'modification_requested' && (
          <>
            <span className="text-6xl mb-4 animate-pulse block">🎨</span>
            <h3 className="text-2xl font-bold text-text-dark-brown font-heading mb-2">Your book is being prepared</h3>
            <p className="text-text-slate max-w-sm">Our designers are currently working on personalising your activity book. We'll notify you once it's ready for review.</p>
          </>
        )}

        {status === 'modification_requested' && (
          <>
            <span className="text-6xl mb-4 block">⏳</span>
            <h3 className="text-2xl font-bold text-text-dark-brown font-heading mb-2">Modification in progress</h3>
            <p className="text-text-slate max-w-sm">We've received your request and are updating the designs. You'll receive a new version soon.</p>
          </>
        )}

        {isEbookReady && (
          <>
            <div className="w-16 h-16 rounded-full bg-accent-mint/20 text-emerald-500 flex items-center justify-center mb-4">
              <CheckCircle2 className="w-8 h-8" />
            </div>
            <h3 className="text-2xl font-bold text-text-dark-brown font-heading mb-2">Your Personalised Book Is Ready 🎉</h3>
            <p className="text-text-slate max-w-sm mb-8">Please review the digital proof below. If everything looks perfect, approve it so we can start printing!</p>
            
            <div className="flex flex-col sm:flex-row gap-4 w-full justify-center">
              {pdfUrl && (
                <a href={pdfUrl} target="_blank" rel="noopener noreferrer" className="flex-1">
                  <Button variant="outline" className="w-full h-full">View PDF Proof</Button>
                </a>
              )}
              
              <Button variant="primary" onClick={handleApprove} disabled={loading} className="flex-1 gap-2 bg-emerald-500 hover:bg-emerald-600 shadow-emerald-500/20 text-white border-transparent">
                <CheckCircle2 className="w-5 h-5" /> Approve Book
              </Button>
            </div>

            <div className="mt-8 pt-6 border-t border-slate-100 w-full flex flex-col items-center">
              <p className="text-sm font-bold text-text-slate mb-4 flex items-center gap-2">
                <AlertCircle className="w-4 h-4"/> Modifications: {modificationCount} of {maxModifications} used
              </p>
              {hasModificationsLeft ? (
                <button 
                  onClick={() => setIsModalOpen(true)}
                  className="flex items-center gap-2 text-honey-amber font-bold hover:text-honey-yellow transition-colors"
                >
                  <MessageSquarePlus className="w-4 h-4" /> Request a change
                </button>
              ) : (
                <span className="text-sm text-red-500 font-bold bg-red-50 px-4 py-2 rounded-lg">Maximum modification requests used</span>
              )}
            </div>
          </>
        )}
      </div>

      <AnimatePresence>
        {isModalOpen && (
          <>
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsModalOpen(false)}
              className="fixed inset-0 bg-text-dark-brown/40 backdrop-blur-sm z-50"
            />
            <motion.div 
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-lg bg-white rounded-[2.5rem] p-8 shadow-2xl z-50 border border-honey-light/50"
            >
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-2xl font-extrabold text-text-dark-brown font-heading">Request Modification</h3>
                <button onClick={() => setIsModalOpen(false)} className="w-10 h-10 rounded-full bg-slate-100 hover:bg-slate-200 flex items-center justify-center text-text-slate transition-colors">
                  <X className="w-5 h-5" />
                </button>
              </div>
              
              <div className="mb-6 bg-amber-50 p-4 rounded-2xl border border-amber-100">
                <p className="text-sm font-medium text-amber-800">
                  You have <strong>{maxModifications - modificationCount}</strong> modification request(s) remaining for this order.
                </p>
              </div>

              <form onSubmit={handleSubmitModification}>
                <div className="mb-6">
                  <label className="block text-sm font-bold text-text-slate mb-2">What would you like us to modify?</label>
                  <textarea 
                    value={requestText}
                    onChange={(e) => setRequestText(e.target.value)}
                    required
                    rows={5}
                    placeholder="E.g. Please change the child's name on page 4, it is misspelled..."
                    className="w-full px-4 py-3 rounded-2xl border border-slate-200 focus:outline-none focus:border-honey-yellow focus:ring-1 focus:ring-honey-yellow resize-none"
                  ></textarea>
                </div>
                
                {error && <p className="text-red-500 text-sm font-bold mb-4">{error}</p>}

                <Button type="submit" variant="primary" className="w-full" disabled={loading}>
                  {loading ? 'Submitting...' : 'Submit Request'}
                </Button>
              </form>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
