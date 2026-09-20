import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { JobCategory, TargetRegion, ProofRequirement } from '../../types';
import { 
  PlusCircle, 
  Trash2, 
  DollarSign, 
  Calculator, 
  AlertCircle, 
  CheckCircle2, 
  Sparkles,
  ArrowRight,
  ShieldCheck,
  Wallet
} from 'lucide-react';

const CATEGORIES: JobCategory[] = [
  'YouTube',
  'Facebook & Social',
  'Mobile App Install',
  'SEO & Web Visit',
  'Sign Up & Referral',
  'Telegram / Discord',
  'Survey & Quiz',
  'Review & Rating'
];

interface Props {
  onSuccess: () => void;
  onGoDeposit: () => void;
}

export const EmployerPostJob: React.FC<Props> = ({ onSuccess, onGoDeposit }) => {
  const { currentUser, config, createJob } = useApp();

  // Form states
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState<JobCategory>('YouTube');
  const [region, setRegion] = useState<TargetRegion>('Bangladesh');
  const [estimatedMinutes, setEstimatedMinutes] = useState(3);
  const [description, setDescription] = useState('');
  
  // Steps
  const [steps, setSteps] = useState<string[]>([
    'ইউটিউবে গিয়ে আমাদের চ্যানেলের নাম সার্চ করুন',
    'ভিডিওটি না টেনে অন্তত ৩ মিনিট দেখুন',
    'ভিডিওতে লাইক দিন এবং চ্যানেল সাবস্ক্রাইব করুন'
  ]);

  // Proofs
  const [requiredProofs, setRequiredProofs] = useState<ProofRequirement[]>([
    { id: 'p1', instruction: 'আপনার ইউটিউব চ্যানেলের ইউজারনেম (@handle)', type: 'text' },
    { id: 'p2', instruction: 'লাইক ও সাবস্ক্রাইব করা অবস্থার স্ক্রিনশট', type: 'screenshot' }
  ]);

  // Budget
  const [workersNeeded, setWorkersNeeded] = useState(50);
  const [rewardPerWorker, setRewardPerWorker] = useState(0.05);

  const [errorMessage, setErrorMessage] = useState('');

  // Calculations
  const workerTotalCost = workersNeeded * rewardPerWorker;
  const platformFee = (workerTotalCost * config.platformFeePercent) / 100;
  const totalBudgetRequired = +(workerTotalCost + platformFee).toFixed(2);
  const totalBDTRequired = (totalBudgetRequired * config.dollarRateInBDT).toFixed(0);

  const isBalanceSufficient = currentUser.employerBalance >= totalBudgetRequired;

  // Handlers for steps
  const handleAddStep = () => {
    setSteps(prev => [...prev, '']);
  };

  const handleStepChange = (idx: number, val: string) => {
    setSteps(prev => {
      const next = [...prev];
      next[idx] = val;
      return next;
    });
  };

  const handleRemoveStep = (idx: number) => {
    if (steps.length <= 1) return;
    setSteps(prev => prev.filter((_, i) => i !== idx));
  };

  // Handlers for proofs
  const handleAddProof = (type: 'text' | 'screenshot') => {
    setRequiredProofs(prev => [
      ...prev,
      {
        id: `p_${Date.now()}`,
        instruction: type === 'text' ? 'প্রয়োজনীয় টেক্সট তথ্য লিখুন' : 'কাজের শেষ স্ক্রিনশট আপলোড করুন',
        type
      }
    ]);
  };

  const handleProofChange = (id: string, text: string) => {
    setRequiredProofs(prev => prev.map(p => p.id === id ? { ...p, instruction: text } : p));
  };

  const handleRemoveProof = (id: string) => {
    if (requiredProofs.length <= 1) return;
    setRequiredProofs(prev => prev.filter(p => p.id !== id));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');

    if (!title.trim()) {
      setErrorMessage('কাজের একটি স্পষ্ট শিরোনাম লিখুন!');
      return;
    }

    if (!description.trim()) {
      setErrorMessage('কাজের বিবরণ লিখুন!');
      return;
    }

    const cleanSteps = steps.map(s => s.trim()).filter(Boolean);
    if (cleanSteps.length === 0) {
      setErrorMessage('অন্তত একটি স্টেপ নির্দেশনা লিখুন!');
      return;
    }

    const cleanProofs = requiredProofs.filter(p => p.instruction.trim() !== '');
    if (cleanProofs.length === 0) {
      setErrorMessage('অন্তত একটি প্রুফ রিকোয়ারমেন্ট দিন!');
      return;
    }

    const res = createJob({
      title: title.trim(),
      category,
      region,
      estimatedMinutes,
      description: description.trim(),
      steps: cleanSteps,
      requiredProofs: cleanProofs,
      totalWorkersNeeded: workersNeeded,
      rewardPerWorker,
      autoApproveHours: config.autoApproveHours
    });

    if (res.success) {
      onSuccess();
    } else {
      setErrorMessage(res.message || 'জব পোস্ট করতে সমস্যা হয়েছে!');
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      
      {/* Top Header */}
      <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-slate-900 flex items-center gap-2">
            <PlusCircle className="w-5 h-5 text-blue-600" />
            নতুন মাইক্রো জব পোস্ট করুন (Post New Job)
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            আপনার ইউটিউব চ্যানেল, সোশ্যাল পেজ, অ্যাপ বা ওয়েবসাইটের হাজার হাজার রিয়েল ইউজার এনগেজমেন্ট নিন।
          </p>
        </div>

        <div className="bg-blue-50 border border-blue-200 px-4 py-2.5 rounded-2xl flex items-center gap-3">
          <Wallet className="w-5 h-5 text-blue-600 shrink-0" />
          <div className="text-left">
            <span className="text-[10px] text-blue-700 font-semibold block">আপনার ডিপোজিট ব্যালেন্স</span>
            <span className="text-sm font-extrabold text-blue-950">
              ${currentUser.employerBalance.toFixed(2)} 
              <span className="text-xs font-normal text-blue-700 ml-1">
                (৳{(currentUser.employerBalance * config.dollarRateInBDT).toFixed(0)})
              </span>
            </span>
          </div>
        </div>
      </div>

      {errorMessage && (
        <div className="bg-rose-50 border border-rose-200 text-rose-800 p-4 rounded-2xl text-xs flex items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0 text-rose-600" />
            <span>{errorMessage}</span>
          </div>
          {!isBalanceSufficient && (
            <button
              onClick={onGoDeposit}
              className="px-3 py-1 bg-rose-600 text-white rounded-xl text-xs font-bold hover:bg-rose-700 shrink-0"
            >
              টাকা ডিপোজিট করুন
            </button>
          )}
        </div>
      )}

      {/* Main Form */}
      <form onSubmit={handleSubmit} className="space-y-6">
        
        {/* Step 1: Basic Information */}
        <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-xs space-y-4">
          <h3 className="text-sm font-bold text-slate-900 border-b border-slate-100 pb-2.5">
            ১. প্রাথমিক তথ্য ও ক্যাটাগরি
          </h3>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">
              কাজের শিরোনাম (Title):
            </label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="যেমন: ইউটিউব ভিডিও ৩ মিনিট দেখা + সাবস্ক্রাইব করুন"
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-xs sm:text-sm font-medium focus:ring-2 focus:ring-blue-500 focus:outline-none"
              required
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">ক্যাটাগরি:</label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value as JobCategory)}
                className="w-full px-3 py-2.5 rounded-xl border border-slate-300 text-xs font-semibold text-slate-800 bg-white focus:ring-2 focus:ring-blue-500"
              >
                {CATEGORIES.map(cat => (
                  <option key={cat} value={cat}>{cat}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">টার্গেট রিজিয়ন / দেশ:</label>
              <select
                value={region}
                onChange={(e) => setRegion(e.target.value as TargetRegion)}
                className="w-full px-3 py-2.5 rounded-xl border border-slate-300 text-xs font-semibold text-slate-800 bg-white focus:ring-2 focus:ring-blue-500"
              >
                <option value="Bangladesh">বাংলাদেশ শুধুমাত্র</option>
                <option value="Asia">এশিয়া</option>
                <option value="International">আন্তর্জাতিক (Worldwide)</option>
                <option value="USA/Europe">ইউএসএ ও ইউরোপ</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">আনুমানিক সময় (মিনিট):</label>
              <input
                type="number"
                min={1}
                max={30}
                value={estimatedMinutes}
                onChange={(e) => setEstimatedMinutes(Number(e.target.value))}
                className="w-full px-3 py-2.5 rounded-xl border border-slate-300 text-xs font-semibold focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">
              কাজের সংক্ষিপ্ত বিবরণ:
            </label>
            <textarea
              rows={3}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="ওয়ার্কারদের জন্য কাজের সাধারণ উদ্দেশ্য ও নিয়মাবলী লিখুন..."
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-xs sm:text-sm focus:ring-2 focus:ring-blue-500 focus:outline-none"
              required
            />
          </div>
        </div>

        {/* Step 2: Step-by-Step Instructions */}
        <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-xs space-y-4">
          <div className="flex items-center justify-between border-b border-slate-100 pb-2.5">
            <div>
              <h3 className="text-sm font-bold text-slate-900">
                ২. ধাপে ধাপে নির্দেশনা (Steps to Complete)
              </h3>
              <p className="text-[11px] text-slate-500">
                ওয়ার্কারকে কাজ করার জন্য স্পষ্ট নির্দেশিকা দিন যাতে কোনো ভুল না হয়।
              </p>
            </div>
            <button
              type="button"
              onClick={handleAddStep}
              className="px-3 py-1.5 rounded-xl bg-blue-50 text-blue-700 hover:bg-blue-100 text-xs font-bold transition-colors flex items-center gap-1"
            >
              <PlusCircle className="w-3.5 h-3.5" />
              নতুন স্টেপ যোগ করুন
            </button>
          </div>

          <div className="space-y-2.5">
            {steps.map((step, idx) => (
              <div key={idx} className="flex items-center gap-2">
                <span className="w-6 h-6 rounded-full bg-slate-900 text-white text-xs font-bold flex items-center justify-center shrink-0">
                  {idx + 1}
                </span>
                <input
                  type="text"
                  value={step}
                  onChange={(e) => handleStepChange(idx, e.target.value)}
                  placeholder={`স্টেপ ${idx + 1} লিখুন...`}
                  className="flex-1 px-3 py-2 rounded-xl border border-slate-300 text-xs font-medium focus:ring-2 focus:ring-blue-500"
                  required
                />
                <button
                  type="button"
                  onClick={() => handleRemoveStep(idx)}
                  disabled={steps.length <= 1}
                  className="p-2 text-slate-400 hover:text-rose-600 disabled:opacity-30 transition-colors"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* Step 3: Required Proofs */}
        <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-xs space-y-4">
          <div className="flex items-center justify-between border-b border-slate-100 pb-2.5">
            <div>
              <h3 className="text-sm font-bold text-slate-900">
                ৩. কাজের প্রমাণ (Required Proofs)
              </h3>
              <p className="text-[11px] text-slate-500">
                ওয়ার্কার কাজ শেষ করে কী কী প্রমাণ (টেক্সট বা স্ক্রিনশট) জমা দেবে তা নির্ধারণ করুন।
              </p>
            </div>
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => handleAddProof('text')}
                className="px-2.5 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold transition-colors"
              >
                + টেক্সট প্রুফ
              </button>
              <button
                type="button"
                onClick={() => handleAddProof('screenshot')}
                className="px-2.5 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold transition-colors"
              >
                + স্ক্রিনশট প্রুফ
              </button>
            </div>
          </div>

          <div className="space-y-3">
            {requiredProofs.map((req, idx) => (
              <div key={req.id} className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200 flex flex-col sm:flex-row sm:items-center gap-3">
                <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider bg-slate-200 text-slate-800 self-start sm:self-auto">
                  {req.type === 'text' ? 'টেক্সট উত্তর' : 'স্ক্রিনশট ছবি'}
                </span>
                <input
                  type="text"
                  value={req.instruction}
                  onChange={(e) => handleProofChange(req.id, e.target.value)}
                  placeholder="প্রুফের রিকোয়ারমেন্ট লিখুন..."
                  className="flex-1 px-3 py-1.5 rounded-xl border border-slate-300 text-xs font-medium bg-white focus:ring-2 focus:ring-blue-500"
                  required
                />
                <button
                  type="button"
                  onClick={() => handleRemoveProof(req.id)}
                  disabled={requiredProofs.length <= 1}
                  className="p-1 text-slate-400 hover:text-rose-600 disabled:opacity-30 self-end sm:self-auto"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* Step 4: Budget & Pricing Calculator */}
        <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-xs space-y-4">
          <h3 className="text-sm font-bold text-slate-900 border-b border-slate-100 pb-2.5 flex items-center gap-2">
            <Calculator className="w-4 h-4 text-blue-600" />
            ৪. বাজেট ও খরচ ক্যালকুলেটর (Budget & Escrow)
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                কতজন ওয়ার্কার প্রয়োজন (Workers Needed):
              </label>
              <input
                type="number"
                min={5}
                max={5000}
                value={workersNeeded}
                onChange={(e) => setWorkersNeeded(Math.max(1, Number(e.target.value)))}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm font-bold focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                প্রতি ওয়ার্কারকে পেমেন্ট (USD):
              </label>
              <div className="relative">
                <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 font-bold">$</span>
                <input
                  type="number"
                  step="0.01"
                  min="0.02"
                  value={rewardPerWorker}
                  onChange={(e) => setRewardPerWorker(Math.max(0.01, Number(e.target.value)))}
                  className="w-full pl-8 pr-28 py-2.5 rounded-xl border border-slate-300 text-sm font-bold focus:ring-2 focus:ring-blue-500"
                  required
                />
                <div className="absolute right-3.5 top-1/2 -translate-y-1/2 text-xs font-semibold text-slate-500">
                  ≈ ৳{(rewardPerWorker * config.dollarRateInBDT).toFixed(1)}
                </div>
              </div>
            </div>
          </div>

          {/* Budget Breakdown Summary */}
          <div className="bg-slate-50 rounded-2xl p-4 border border-slate-200 space-y-2 text-xs">
            <div className="flex justify-between text-slate-600">
              <span>ওয়ার্কারদের মোট পেমেন্ট ({workersNeeded} জন × ${rewardPerWorker}):</span>
              <strong className="text-slate-900">${workerTotalCost.toFixed(2)}</strong>
            </div>
            <div className="flex justify-between text-slate-600">
              <span>প্ল্যাটফর্ম ফি ({config.platformFeePercent}% কমিশন):</span>
              <strong className="text-slate-900">${platformFee.toFixed(2)}</strong>
            </div>
            <div className="border-t border-slate-200 pt-2 flex justify-between text-sm font-extrabold text-slate-900">
              <span>মোট খরচ (Total Escrow Budget):</span>
              <div className="text-right">
                <span className="text-blue-600 text-base">${totalBudgetRequired} USD</span>
                <span className="block text-xs font-semibold text-slate-500">
                  (৳{totalBDTRequired} BDT)
                </span>
              </div>
            </div>
          </div>

          {!isBalanceSufficient && (
            <div className="p-3.5 rounded-2xl bg-amber-50 border border-amber-200 text-amber-900 text-xs flex items-center justify-between gap-3">
              <span>আপনার ডিপোজিট ব্যালেন্সে প্রয়োজনীয় টাকা নেই। অনুগ্রহ করে ব্যালেন্স রিচার্জ করুন।</span>
              <button
                type="button"
                onClick={onGoDeposit}
                className="px-3 py-1.5 bg-amber-600 hover:bg-amber-700 text-white rounded-xl font-bold shrink-0 transition-colors"
              >
                ডিপোজিট করুন
              </button>
            </div>
          )}
        </div>

        {/* Submit Button */}
        <div className="flex items-center justify-end gap-4 pt-2">
          <button
            type="submit"
            disabled={!isBalanceSufficient}
            className="flex items-center gap-2 px-8 py-3.5 rounded-2xl bg-blue-600 hover:bg-blue-700 text-white text-sm font-bold shadow-lg shadow-blue-200 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <span>জব পাবলিশ করুন (${totalBudgetRequired})</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>

      </form>
    </div>
  );
};
