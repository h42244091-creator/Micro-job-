import React, { useState } from 'react';
import { Job, SubmittedProofItem } from '../../types';
import { useApp } from '../../context/AppContext';
import { 
  X, 
  CheckCircle2, 
  AlertCircle, 
  Upload, 
  DollarSign, 
  Clock, 
  Globe, 
  Camera, 
  FileText,
  ShieldAlert,
  Send,
  Sparkles
} from 'lucide-react';

interface Props {
  job: Job;
  onClose: () => void;
  onSuccess: () => void;
}

export const JobDetailModal: React.FC<Props> = ({ job, onClose, onSuccess }) => {
  const { submitTask, config } = useApp();
  
  // State for proof responses
  const [proofValues, setProofValues] = useState<{ [proofId: string]: string }>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const handleTextChange = (proofId: string, val: string) => {
    setProofValues(prev => ({ ...prev, [proofId]: val }));
  };

  const handleImageUpload = (proofId: string, e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setProofValues(prev => ({ ...prev, [proofId]: reader.result as string }));
      };
      reader.readAsDataURL(file);
    }
  };

  // Sample quick screenshot demo button for reviewer convenience
  const handleQuickSampleImage = (proofId: string) => {
    const samples = [
      'https://images.unsplash.com/photo-1611162617474-5b21e879e113?w=800&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1563986768609-322da13575f3?w=800&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=800&auto=format&fit=crop&q=80'
    ];
    const chosen = samples[Math.floor(Math.random() * samples.length)];
    setProofValues(prev => ({ ...prev, [proofId]: chosen }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');

    // Validate that all proofs are provided
    for (const req of job.requiredProofs) {
      if (!proofValues[req.id] || proofValues[req.id].trim() === '') {
        setErrorMessage(`দয়া করে "${req.instruction}" প্রুফটি পূরণ করুন!`);
        return;
      }
    }

    setIsSubmitting(true);
    const submittedProofs: SubmittedProofItem[] = job.requiredProofs.map(req => ({
      proofId: req.id,
      instruction: req.instruction,
      type: req.type,
      value: proofValues[req.id]
    }));

    await new Promise(r => setTimeout(r, 600)); // smooth experience
    const res = submitTask(job.id, submittedProofs);
    setIsSubmitting(false);
    if (!res.success) {
      setErrorMessage(res.message);
      return;
    }
    onSuccess();
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4 overflow-y-auto">
      <div className="bg-white rounded-3xl max-w-2xl w-full shadow-2xl border border-slate-200 overflow-hidden my-6 animate-in zoom-in-95">
        
        {/* Top Header */}
        <div className="bg-slate-900 text-white p-5 sm:p-6 relative">
          <button
            onClick={onClose}
            className="absolute top-5 right-5 w-8 h-8 rounded-full bg-slate-800 hover:bg-slate-700 text-slate-300 flex items-center justify-center transition-colors"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="flex flex-wrap items-center gap-2 mb-2">
            <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
              {job.category}
            </span>
            <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-slate-800 text-slate-300 flex items-center gap-1">
              <Globe className="w-3 h-3" />
              {job.region}
            </span>
            <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-slate-800 text-slate-300 flex items-center gap-1">
              <Clock className="w-3 h-3" />
              আনুমানিক {job.estimatedMinutes} মিনিট
            </span>
          </div>

          <h2 className="text-lg sm:text-xl font-bold text-white tracking-tight">
            {job.title}
          </h2>

          <div className="mt-4 flex items-center justify-between border-t border-slate-800 pt-3">
            <div>
              <span className="text-xs text-slate-400 block">কাজের পেমেন্ট (Reward)</span>
              <div className="text-xl font-extrabold text-emerald-400 flex items-center gap-1">
                ${job.rewardPerWorker.toFixed(2)}
                <span className="text-xs font-normal text-slate-300">
                  (৳{(job.rewardPerWorker * config.dollarRateInBDT).toFixed(0)} BDT)
                </span>
              </div>
            </div>
            <div className="text-right">
              <span className="text-xs text-slate-400 block">ওয়ার্কার স্লট</span>
              <span className="text-sm font-semibold text-slate-200">
                {job.completedWorkers} / {job.totalWorkersNeeded} জন সম্পন্ন
              </span>
            </div>
          </div>
        </div>

        {/* Modal Body */}
        <div className="p-5 sm:p-6 space-y-6 max-h-[65vh] overflow-y-auto">
          
          {/* Employer Description */}
          <div>
            <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">
              কাজের বিস্তারিত বিবরণ
            </h3>
            <p className="text-sm text-slate-700 leading-relaxed bg-slate-50 p-3.5 rounded-2xl border border-slate-100">
              {job.description}
            </p>
          </div>

          {/* Steps to complete */}
          <div>
            <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2.5 flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
              ধাপে ধাপে করণীয় নির্দেশনা (Steps)
            </h3>
            <ol className="space-y-2">
              {job.steps.map((step, idx) => (
                <li key={idx} className="flex items-start gap-3 text-xs sm:text-sm text-slate-700 bg-emerald-50/50 p-2.5 rounded-xl border border-emerald-100/60">
                  <span className="w-5 h-5 rounded-full bg-emerald-600 text-white font-bold text-xs flex items-center justify-center shrink-0 mt-0.5">
                    {idx + 1}
                  </span>
                  <span>{step}</span>
                </li>
              ))}
            </ol>
          </div>

          {/* Anti-cheat Notice */}
          <div className="bg-amber-50 border border-amber-200 rounded-2xl p-3 flex items-start gap-3 text-xs text-amber-900">
            <ShieldAlert className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
            <div>
              <strong className="font-semibold block mb-0.5">সতর্কবার্তা:</strong>
              ভুল তথ্য বা ফেক স্ক্রিনশট সাবমিট করলে রেটিং কমে যাবে এবং এমপ্লয়ার রিজেক্ট করলে অ্যাকাউন্ট সাময়িক স্থগিত হতে পারে।
            </div>
          </div>

          {/* Proof Submission Form */}
          <form id="proof-submission-form" onSubmit={handleSubmit} className="border-t border-slate-200 pt-5 space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                <FileText className="w-4 h-4 text-slate-700" />
                প্রমাণ সাবমিট করুন (Submit Proofs)
              </h3>
              <span className="text-[11px] text-slate-500">
                অটো অ্যাপ্রুভ সময়সীমা: {job.autoApproveHours} ঘণ্টা
              </span>
            </div>

            {errorMessage && (
              <div className="bg-rose-50 border border-rose-200 text-rose-700 p-3 rounded-xl text-xs flex items-center gap-2">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{errorMessage}</span>
              </div>
            )}

            {job.requiredProofs.map((req, idx) => (
              <div key={req.id} className="bg-slate-50 p-3.5 rounded-2xl border border-slate-200 space-y-2">
                <label className="block text-xs font-semibold text-slate-800">
                  প্রুফ #{idx + 1}: {req.instruction}
                </label>

                {req.type === 'text' ? (
                  <textarea
                    rows={2}
                    placeholder="এখানে আপনার প্রমাণ লিখুন (যেমন: ইউজারনেম, ইমেইল, বা লিংক)..."
                    value={proofValues[req.id] || ''}
                    onChange={(e) => handleTextChange(req.id, e.target.value)}
                    className="w-full text-xs p-2.5 rounded-xl border border-slate-300 bg-white focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                    required
                  />
                ) : (
                  <div className="space-y-2">
                    {proofValues[req.id] ? (
                      <div className="relative rounded-xl overflow-hidden border border-slate-300 max-h-48 bg-slate-900 flex items-center justify-center">
                        <img 
                          src={proofValues[req.id]} 
                          alt="Uploaded Proof" 
                          className="max-h-48 object-contain"
                        />
                        <button
                          type="button"
                          onClick={() => handleTextChange(req.id, '')}
                          className="absolute top-2 right-2 bg-slate-900/80 text-white text-xs px-2 py-1 rounded-lg hover:bg-rose-600 transition-colors"
                        >
                          মুছে ফেলুন
                        </button>
                      </div>
                    ) : (
                      <div className="flex flex-col sm:flex-row items-center gap-2">
                        <label className="flex-1 w-full flex items-center justify-center gap-2 p-3 border-2 border-dashed border-slate-300 hover:border-emerald-500 rounded-xl cursor-pointer bg-white text-xs text-slate-600 transition-colors">
                          <Camera className="w-4 h-4 text-emerald-600" />
                          <span>স্ক্রিনশট নির্বাচন করুন (PNG/JPG)</span>
                          <input
                            type="file"
                            accept="image/*"
                            onChange={(e) => handleImageUpload(req.id, e)}
                            className="hidden"
                          />
                        </label>
                        
                        <button
                          type="button"
                          onClick={() => handleQuickSampleImage(req.id)}
                          className="w-full sm:w-auto px-3 py-2.5 rounded-xl border border-emerald-300 text-emerald-700 bg-emerald-50 hover:bg-emerald-100 text-xs font-semibold shrink-0 transition-colors"
                          title="দ্রুত টেস্ট করার জন্য স্যাম্পল স্ক্রিনশট লাগান"
                        >
                          স্যাম্পল ছবি ব্যবহার করুন
                        </button>
                      </div>
                    )}
                  </div>
                )}
              </div>
            ))}

            {/* Bottom Actions */}
            <div className="flex items-center justify-end gap-3 pt-2">
              <button
                type="button"
                onClick={onClose}
                disabled={isSubmitting}
                className="px-4 py-2.5 rounded-xl border border-slate-300 text-xs font-semibold text-slate-700 hover:bg-slate-50 transition-colors"
              >
                বাতিল করুন
              </button>
              <button
                type="submit"
                disabled={isSubmitting}
                className="flex items-center gap-2 px-6 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold shadow-md shadow-emerald-200 transition-all disabled:opacity-50"
              >
                {isSubmitting ? (
                  <span>সাবমিট হচ্ছে...</span>
                ) : (
                  <>
                    <Send className="w-3.5 h-3.5" />
                    <span>প্রুফ জমা দিন (${job.rewardPerWorker})</span>
                  </>
                )}
              </button>
            </div>
          </form>

        </div>
      </div>
    </div>
  );
};
