import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { Job, TaskSubmission } from '../../types';
import { 
  Briefcase, 
  CheckCircle, 
  Clock, 
  XCircle, 
  Eye, 
  Pause, 
  Play, 
  CheckCircle2, 
  AlertCircle, 
  RotateCcw,
  User,
  Image as ImageIcon
} from 'lucide-react';

export const EmployerManageJobs: React.FC = () => {
  const { jobs, submissions, currentUser, toggleJobStatus, reviewSubmission, config } = useApp();

  // Employer's jobs
  const myJobs = jobs.filter(j => j.employerId === currentUser.id);

  const [selectedJobForReview, setSelectedJobForReview] = useState<Job | null>(null);
  const [rejectingSub, setRejectingSub] = useState<TaskSubmission | null>(null);
  const [rejectReason, setRejectReason] = useState('');
  const [previewImage, setPreviewImage] = useState<string | null>(null);

  // Submissions for the selected review job
  const jobSubmissions = selectedJobForReview
    ? submissions.filter(s => s.jobId === selectedJobForReview.id)
    : [];

  const handleApprove = (subId: string) => {
    reviewSubmission(subId, 'approved');
  };

  const handleRejectSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!rejectingSub) return;
    reviewSubmission(rejectingSub.id, 'rejected', rejectReason || 'প্রুফ সঠিক পাওয়া যায়নি');
    setRejectingSub(null);
    setRejectReason('');
  };

  return (
    <div className="space-y-6">
      
      {/* Top Header */}
      <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-xs flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold text-slate-900">আমার পোস্ট করা জব (Manage Posted Jobs)</h2>
          <p className="text-xs text-slate-500 mt-0.5">
            আপনার চলমান কাজের অগ্রগতি দেখুন এবং জমা হওয়া প্রুফ যাচাই করে পেমেন্ট রিলিজ বা রিজেক্ট করুন।
          </p>
        </div>
      </div>

      {/* Jobs List */}
      {myJobs.length === 0 ? (
        <div className="bg-white rounded-3xl p-12 text-center border border-slate-200">
          <Briefcase className="w-10 h-10 text-slate-300 mx-auto mb-3" />
          <h3 className="text-base font-bold text-slate-700">আপনি এখনো কোনো জব পোস্ট করেননি!</h3>
          <p className="text-xs text-slate-500 mt-1">
            উপরে "নতুন জব পোস্ট করুন" বাটনে ক্লিক করে কাজ শুরু করুন।
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {myJobs.map(job => {
            const pendingCount = submissions.filter(s => s.jobId === job.id && s.status === 'pending').length;
            const progressPct = Math.min(100, Math.round((job.completedWorkers / job.totalWorkersNeeded) * 100));

            return (
              <div 
                key={job.id}
                className="bg-white rounded-2xl p-5 border border-slate-200 shadow-xs flex flex-col lg:flex-row lg:items-center justify-between gap-5"
              >
                <div className="space-y-2 flex-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="px-2.5 py-0.5 rounded-md text-[11px] font-bold bg-blue-50 text-blue-700 border border-blue-100">
                      {job.category}
                    </span>
                    <span className={`px-2.5 py-0.5 rounded-md text-[11px] font-bold ${
                      job.status === 'active' ? 'bg-emerald-50 text-emerald-700 border border-emerald-200' :
                      job.status === 'paused' ? 'bg-amber-50 text-amber-700 border border-amber-200' :
                      'bg-slate-100 text-slate-600'
                    }`}>
                      {job.status === 'active' ? '● চলমান (Active)' : job.status === 'paused' ? '❚❚ পজ করা (Paused)' : 'সম্পন্ন (Completed)'}
                    </span>
                    <span className="text-xs text-slate-400">
                      পোস্ট তারিখ: {job.createdAt}
                    </span>
                  </div>

                  <h3 className="text-base font-bold text-slate-900 leading-snug">
                    {job.title}
                  </h3>

                  {/* Progress bar */}
                  <div className="max-w-md space-y-1 pt-1">
                    <div className="flex justify-between text-xs text-slate-500">
                      <span>সম্পন্ন কর্মী: <strong>{job.completedWorkers} / {job.totalWorkersNeeded}</strong></span>
                      <span className="font-semibold text-slate-700">{progressPct}%</span>
                    </div>
                    <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
                      <div 
                        className="h-full bg-blue-600 rounded-full transition-all duration-300"
                        style={{ width: `${progressPct}%` }}
                      />
                    </div>
                  </div>
                </div>

                {/* Right side buttons and review badge */}
                <div className="flex flex-col sm:flex-row lg:flex-col items-start sm:items-center lg:items-end justify-between gap-3 shrink-0 pt-3 lg:pt-0 border-t lg:border-t-0 border-slate-100">
                  <div className="text-left sm:text-right">
                    <span className="text-[11px] text-slate-400 block">প্রতি কাজে রেট</span>
                    <span className="text-base font-bold text-slate-900">
                      ${job.rewardPerWorker.toFixed(2)}
                      <span className="text-xs font-normal text-slate-500 ml-1">
                        (৳{(job.rewardPerWorker * config.dollarRateInBDT).toFixed(0)})
                      </span>
                    </span>
                  </div>

                  <div className="flex items-center gap-2">
                    {/* Pause / Resume button */}
                    <button
                      onClick={() => toggleJobStatus(job.id)}
                      className="p-2 rounded-xl border border-slate-300 hover:bg-slate-50 text-slate-600 transition-colors"
                      title={job.status === 'active' ? 'জব সাময়িক বন্ধ রাখুন' : 'জব পুনরায় চালু করুন'}
                    >
                      {job.status === 'active' ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
                    </button>

                    {/* Review proofs button */}
                    <button
                      onClick={() => setSelectedJobForReview(job)}
                      className="relative px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold shadow-xs transition-colors flex items-center gap-1.5"
                    >
                      <Eye className="w-3.5 h-3.5" />
                      <span>প্রুফ যাচাই করুন</span>
                      {pendingCount > 0 && (
                        <span className="ml-1 bg-amber-400 text-slate-950 px-1.5 py-0.2 rounded-full text-[10px] font-extrabold">
                          {pendingCount}
                        </span>
                      )}
                    </button>
                  </div>
                </div>

              </div>
            );
          })}
        </div>
      )}

      {/* Submissions Review Modal */}
      {selectedJobForReview && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4">
          <div className="bg-white rounded-3xl max-w-3xl w-full p-6 shadow-2xl border border-slate-200 max-h-[90vh] flex flex-col animate-in zoom-in-95">
            
            {/* Modal Header */}
            <div className="flex items-start justify-between pb-4 border-b border-slate-100">
              <div>
                <span className="text-[11px] font-bold text-blue-600 uppercase tracking-wider">
                  প্রুফ অডিট ও রিভিউ পোর্টাল
                </span>
                <h3 className="text-base sm:text-lg font-bold text-slate-900 leading-tight mt-0.5">
                  {selectedJobForReview.title}
                </h3>
              </div>
              <button 
                onClick={() => setSelectedJobForReview(null)}
                className="text-slate-400 hover:text-slate-600 text-base font-bold p-1"
              >
                ✕
              </button>
            </div>

            {/* Modal Body - Submissions List */}
            <div className="flex-1 overflow-y-auto py-4 space-y-4">
              {jobSubmissions.length === 0 ? (
                <div className="text-center py-12 text-slate-400 text-xs">
                  এই কাজে এখনো কোনো ওয়ার্কার প্রুফ জমা দেয়নি।
                </div>
              ) : (
                jobSubmissions.map(sub => (
                  <div 
                    key={sub.id}
                    className="bg-slate-50 rounded-2xl p-4 border border-slate-200 space-y-3"
                  >
                    <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-200/60 pb-2.5">
                      <div className="flex items-center gap-2">
                        <div className="w-7 h-7 rounded-full bg-slate-200 text-slate-700 flex items-center justify-center font-bold text-xs">
                          {sub.workerName[0]}
                        </div>
                        <div>
                          <span className="text-xs font-bold text-slate-800">{sub.workerName}</span>
                          <span className="text-[11px] text-slate-400 block -mt-0.5">
                            জমা: {sub.submittedAt}
                          </span>
                        </div>
                      </div>

                      {/* Status badge */}
                      <div>
                        {sub.status === 'pending' && (
                          <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-amber-100 text-amber-800">
                            পেন্ডিং (Review Pending)
                          </span>
                        )}
                        {sub.status === 'approved' && (
                          <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800">
                            ✓ অ্যাপ্রুভড (Paid ${sub.reward})
                          </span>
                        )}
                        {sub.status === 'rejected' && (
                          <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-rose-100 text-rose-800">
                            ✕ রিজেক্টেড ({sub.rejectionReason})
                          </span>
                        )}
                      </div>
                    </div>

                    {/* Proof Answers Submitted */}
                    <div className="space-y-2 text-xs">
                      {sub.proofs.map((p, pIdx) => (
                        <div key={pIdx} className="bg-white p-3 rounded-xl border border-slate-200">
                          <span className="text-[11px] font-bold text-slate-500 block mb-1">
                            প্রুফ #{pIdx + 1}: {p.instruction}
                          </span>
                          {p.type === 'text' ? (
                            <div className="font-mono text-slate-800 break-all bg-slate-50 p-2 rounded-lg text-xs">
                              {p.value}
                            </div>
                          ) : (
                            <div>
                              <button
                                type="button"
                                onClick={() => setPreviewImage(p.value)}
                                className="inline-flex items-center gap-1 text-blue-600 hover:underline font-semibold"
                              >
                                <ImageIcon className="w-3.5 h-3.5" />
                                <span>স্ক্রিনশট বড় করে দেখুন (View Full Image)</span>
                              </button>
                              <img 
                                src={p.value} 
                                alt="Proof" 
                                className="mt-2 max-h-36 rounded-lg border border-slate-300 object-cover cursor-pointer hover:opacity-90"
                                onClick={() => setPreviewImage(p.value)}
                              />
                            </div>
                          )}
                        </div>
                      ))}
                    </div>

                    {/* Action buttons if status is pending */}
                    {sub.status === 'pending' && (
                      <div className="flex items-center justify-end gap-2 pt-1 border-t border-slate-200/60">
                        <button
                          onClick={() => setRejectingSub(sub)}
                          className="px-3 py-1.5 rounded-xl border border-rose-300 text-rose-700 hover:bg-rose-50 text-xs font-semibold transition-colors"
                        >
                          রিজেক্ট করুন
                        </button>
                        <button
                          onClick={() => handleApprove(sub.id)}
                          className="px-4 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold shadow-xs transition-colors flex items-center gap-1"
                        >
                          <CheckCircle2 className="w-3.5 h-3.5" />
                          <span>সন্তুষ্ট (পেমেন্ট অনুমোদন)</span>
                        </button>
                      </div>
                    )}

                  </div>
                ))
              )}
            </div>

            {/* Footer */}
            <div className="pt-3 border-t border-slate-100 flex justify-end">
              <button
                onClick={() => setSelectedJobForReview(null)}
                className="px-5 py-2 bg-slate-900 text-white rounded-xl text-xs font-bold hover:bg-slate-800"
              >
                সম্পন্ন
              </button>
            </div>

          </div>
        </div>
      )}

      {/* Reject Modal */}
      {rejectingSub && (
        <div className="fixed inset-0 z-60 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-sm w-full p-6 shadow-2xl border border-slate-200 animate-in zoom-in-95">
            <h3 className="text-base font-bold text-slate-900 mb-1">কাজটি কেন রিজেক্ট করছেন?</h3>
            <p className="text-xs text-slate-500 mb-3">
              ওয়ার্কারকে স্পষ্ট কারণ জানান যাতে অযথা বিতর্ক সৃষ্টি না হয়।
            </p>

            <form onSubmit={handleRejectSubmit} className="space-y-3">
              <textarea
                rows={3}
                value={rejectReason}
                onChange={(e) => setRejectReason(e.target.value)}
                placeholder="যেমন: চ্যানেল সাবস্ক্রাইব করা ছিল না বা ভুল স্ক্রিনশট..."
                className="w-full text-xs p-3 rounded-xl border border-slate-300 focus:ring-2 focus:ring-rose-500 focus:outline-none"
                required
              />

              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() => setRejectingSub(null)}
                  className="flex-1 py-2 rounded-xl border border-slate-300 text-xs font-semibold text-slate-700"
                >
                  বাতিল
                </button>
                <button
                  type="submit"
                  className="flex-1 py-2 rounded-xl bg-rose-600 hover:bg-rose-700 text-white text-xs font-bold"
                >
                  নিশ্চিত রিজেক্ট
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Full Image Preview Modal */}
      {previewImage && (
        <div 
          onClick={() => setPreviewImage(null)}
          className="fixed inset-0 z-70 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4 cursor-pointer"
        >
          <div className="max-w-3xl max-h-[85vh] bg-white p-2 rounded-2xl shadow-2xl">
            <img 
              src={previewImage} 
              alt="Screenshot Full Preview" 
              className="max-h-[80vh] w-auto rounded-xl object-contain mx-auto"
            />
          </div>
        </div>
      )}

    </div>
  );
};
