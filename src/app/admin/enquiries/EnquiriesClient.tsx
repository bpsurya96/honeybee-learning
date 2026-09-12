
'use client';
import { useState } from 'react';
import { updateEnquiryAdmin } from '../actions';
import { CheckCircle2, Circle, Clock } from 'lucide-react';

export default function EnquiriesClient({ initialEnquiries }: { initialEnquiries: any[] }) {
  const [loadingId, setLoadingId] = useState('');

  const toggleStatus = async (id: string, currentStatus: string) => {
    setLoadingId(id);
    const newStatus = currentStatus === 'RESOLVED' ? 'PENDING' : 'RESOLVED';
    try {
      await updateEnquiryAdmin(id, newStatus);
      window.location.reload();
    } catch (e: any) {
      alert(e.message || 'Failed to update status');
    }
    setLoadingId('');
  };

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full text-left">
          <thead className="bg-slate-50 border-b border-slate-200">
            <tr>
              <th className="p-4 text-sm font-semibold text-slate-600">Customer</th>
              <th className="p-4 text-sm font-semibold text-slate-600">Type</th>
              <th className="p-4 text-sm font-semibold text-slate-600">Details</th>
              <th className="p-4 text-sm font-semibold text-slate-600">Status</th>
              <th className="p-4 text-sm font-semibold text-slate-600 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {initialEnquiries.map(enquiry => (
              <tr key={enquiry.id} className="hover:bg-slate-50 transition-colors">
                <td className="p-4">
                  <div className="font-bold text-slate-800">{enquiry.customer_name}</div>
                  <div className="text-sm text-slate-500">{enquiry.customer_phone}</div>
                </td>
                <td className="p-4">
                  <span className="px-2.5 py-1 rounded-full text-xs font-medium bg-slate-100 text-slate-700 uppercase">
                    {enquiry.type}
                  </span>
                </td>
                <td className="p-4 text-sm text-slate-600 max-w-xs truncate" title={JSON.stringify(enquiry.details)}>
                  {JSON.stringify(enquiry.details)}
                </td>
                <td className="p-4">
                  {enquiry.status === 'RESOLVED' ? (
                    <span className="flex items-center gap-1 text-sm font-medium text-emerald-600 bg-emerald-50 px-2 py-1 rounded-full w-max">
                      <CheckCircle2 size={14}/> Resolved
                    </span>
                  ) : (
                    <span className="flex items-center gap-1 text-sm font-medium text-amber-600 bg-amber-50 px-2 py-1 rounded-full w-max">
                      <Clock size={14}/> Pending
                    </span>
                  )}
                </td>
                <td className="p-4 text-right">
                  <button 
                    disabled={loadingId === enquiry.id}
                    onClick={() => toggleStatus(enquiry.id, enquiry.status)} 
                    className="text-sm font-medium text-blue-600 hover:text-blue-800 disabled:opacity-50"
                  >
                    Mark as {enquiry.status === 'RESOLVED' ? 'Pending' : 'Resolved'}
                  </button>
                </td>
              </tr>
            ))}
            {initialEnquiries.length === 0 && (
              <tr>
                <td colSpan={5} className="p-8 text-center text-slate-500">No enquiries found.</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
