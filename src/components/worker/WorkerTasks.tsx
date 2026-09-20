import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { TaskSubmission } from '../../types';
import { 
  CheckCircle, 
  Clock, 
  XCircle, 
  AlertTriangle, 
  Eye, 
  ArrowUpRight,
  Image as ImageIcon
} from 'lucide-react';

export const WorkerTasks: React.FC = () => {
  const { submissions, currentUser, config } = useApp();

  const [selectedStatus, setSelectedStatus] = useState<string>('all');
  const [inspectSubmission, setInspectSubmission] = useState<TaskSubmission | null>(null);
  const [previewImage, setPreviewImage] = useState<string | null>(null);

  // Worker's own submissions
  const mySubmissions = submissions.filter(s => s.workerId === currentUser.id);

  const filtered = mySubmissions.filter(sub => {
    if (selectedStatus === 'all') return true;
    return sub.status === selectedStatus;
  });

  return (
    <div className="space-y-6">
      
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-white p-5 rounded-3xl border border-slate-200 shadow-xs">
        <div>
          <h2 className="text-lg font-bold text-slate-900">আমার সাবমিট করা কাজ (My Tasks Tracker)</h2>
          <p className="text-xs text-slate-500 mt-0.5">
            আপনার জমা দেওয়া সমস্ত কাজের প্রমাণ, রিভিউ স্ট্যাটাস এবং পেমেন্ট হিস্ট্রি।
          </p>
        </div>

        {/* Filter Pills */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0">
          {[
            { label: 'সকল কাজ', value: 'all', count: mySubmissions.length },
            { label: 'পেন্ডিং', value: 'pending', count: mySubmissions.filter(s => s.status === 'pending').length },
            { label: 'অ্যাপ্রুভড', value: 'approved', count: mySubmissions.filter(s => s.status === 'approved').length },
            { label: 'রিজেক্টেড', value: 'rejected', count: mySubmissions.filter(s => s.status === 'rejected').length },
          ].map(tab => (
            <button
              key={tab.value}
              onClick={() => setSelectedStatus(tab.value)}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-colors flex items-center gap-1.5 ${
                selectedStatus === tab.value
                  ? 'bg-slate-900 text-white'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              <span>{tab.label}</span>
              <span className={`text-[10px] px-1.5 py-0.2 rounded-full ${
                selectedStatus === tab.value ? 'bg-white/20 text-white' : 'bg-slate-200 text-slate-700'
              }`}>
                {tab.count}
              </span>
            </button>
          ))}
        </div>
      </div>

      {/* Submissions List */}
      {filtered.length === 0 ? (
        <div className="bg-white rounded-3xl p-12 text-center border border-slate-200">
          <Clock className="w-10 h-10 text-slate-300 mx-auto mb-3" />
          <h3 className="text-base font-bold text-slate-700">কোনো কাজের রেকর্ড পাওয়া যায়নি</h3>
          <p className="text-xs text-slate-500 mt-1">
            "কাজ খুঁজুন" মেনু থেকে নতুন কাজ সম্পন্ন করে স্ক্রিনশট ও তথ্য জমা দিন।
          </p>
        </div>
      ) : (
        <div className="space-y-3">
          {filtered.map(sub => {
            return (
              <div 
                key={sub.id}
                className="bg-white rounded-2xl p-4 sm:p-5 border border-slate-200 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4 transition-all hover:border-slate-300"
              >
                <div className="space-y-1.5 flex-1">
                  <div className="flex flex-wrap items-center gap-2">
                    {/* Status Badge */}
                    {sub.status === 'pending' && (
                      <span className="px-2.5 py-0.5 rounded-md text-[11px] font-bold bg-amber-50 text-amber-700 border border-amber-200 flex items-center gap-1">
                        <Clock className="w-3 h-3" />
                        পেন্ডিং রিভিউ (Pending)
                      </span>
                    )}
                    {sub.status === 'approved' && (
                      <span className="px-2.5 py-0.5 rounded-md text-[11px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200 flex items-center gap-1">
                        <CheckCircle className="w-3 h-3" />
                        অ্যাপ্রুভড ও পেইড
                      </span>
                    )}
                    {sub.status === 'rejected' && (
                      <span className="px-2.5 py-0.5 rounded-md text-[11px] font-bold bg-rose-50 text-rose-700 border border-rose-200 flex items-center gap-1">
                        <XCircle className="w-3 h-3" />
                        বাতিল (Rejected)
                      </span>
                    )}

                    <span className="text-xs text-slate-400">
                      জমা দেওয়ার সময়: {sub.submittedAt}
                    </span>
                  </div>

                  <h4 className="text-sm sm:text-base font-bold text-slate-900 leading-snug">
                    {sub.jobTitle}
                  </h4>

                  {/* Rejection Reason if any */}
                  {sub.status === 'rejected' && sub.rejectionReason && (
                    <div className="bg-rose-50/70 p-2.5 rounded-xl border border-rose-100 text-xs text-rose-800">
                      <strong>এমপ্লয়ারের রিজেকশন কারণ:</strong> {sub.rejectionReason}
                    </div>
                  )}
                </div>

                {/* Right side action and reward */}
                <div className="flex sm:flex-col items-center sm:items-end justify-between gap-3 shrink-0 pt-3 sm:pt-0 border-t sm:border-t-0 border-slate-100">
                  <div className="sm:text-right">
                    <span className="text-[11px] text-slate-400 block">পেমেন্ট</span>
                    <span className="text-base font-extrabold text-slate-900">
                      +${sub.reward.toFixed(2)}
                      <span className="text-xs font-normal text-emerald-700 ml-1">
                        (৳{(sub.reward * config.dollarRateInBDT).toFixed(0)})
                      </span>
                    </span>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => setInspectSubmission(sub)}
                      className="px-3.5 py-1.5 rounded-xl border border-slate-300 text-slate-700 hover:bg-slate-50 text-xs font-semibold flex items-center gap-1 transition-colors"
                    >
                      <Eye className="w-3.5 h-3.5" />
                      জমা দেওয়া প্রুফ দেখুন
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Inspect Proof Modal */}
      {inspectSubmission && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 shadow-2xl border border-slate-200 animate-in zoom-in-95 max-h-[85vh] overflow-y-auto">
            <div className="flex items-start justify-between pb-3 border-b border-slate-100">
              <div>
                <h3 className="text-base font-bold text-slate-900">জমা দেওয়া প্রুফের বিবরণ</h3>
                <span className="text-xs text-slate-400">{inspectSubmission.jobTitle}</span>
              </div>
              <button 
                onClick={() => setInspectSubmission(null)}
                className="text-slate-400 hover:text-slate-600 font-bold p-1"
              >
                ✕
              </button>
            </div>

            <div className="py-4 space-y-3">
              {inspectSubmission.proofs.map((p, idx) => (
                <div key={idx} className="bg-slate-50 p-3.5 rounded-2xl border border-slate-200 space-y-1.5 text-xs">
                  <span className="font-semibold text-slate-700 block">
                    প্রুফ #{idx + 1}: {p.instruction}
                  </span>
                  {p.type === 'text' ? (
                    <div className="bg-white p-2.5 rounded-xl border border-slate-200 font-mono text-slate-800 break-all">
                      {p.value}
                    </div>
                  ) : (
                    <div>
                      <button
                        type="button"
                        onClick={() => setPreviewImage(p.value)}
                        className="inline-flex items-center gap-1 text-blue-600 hover:underline font-semibold mb-1"
                      >
                        <ImageIcon className="w-3.5 h-3.5" />
                        <span>স্ক্রিনশট বড় করে দেখুন</span>
                      </button>
                      <img 
                        src={p.value} 
                        alt="Screenshot Proof" 
                        className="max-h-48 rounded-xl border border-slate-300 object-cover cursor-pointer hover:opacity-90"
                        onClick={() => setPreviewImage(p.value)}
                      />
                    </div>
                  )}
                </div>
              ))}
            </div>

            <div className="pt-3 border-t border-slate-100 flex justify-end">
              <button
                onClick={() => setInspectSubmission(null)}
                className="px-5 py-2 bg-slate-900 text-white rounded-xl text-xs font-bold"
              >
                ঠিক আছে
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Image Full Preview */}
      {previewImage && (
        <div 
          onClick={() => setPreviewImage(null)}
          className="fixed inset-0 z-60 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4 cursor-pointer"
        >
          <div className="max-w-3xl max-h-[85vh] bg-white p-2 rounded-2xl shadow-2xl">
            <img 
              src={previewImage} 
              alt="Screenshot Preview" 
              className="max-h-[80vh] w-auto rounded-xl object-contain mx-auto"
            />
          </div>
        </div>
      )}

    </div>
  );
};
