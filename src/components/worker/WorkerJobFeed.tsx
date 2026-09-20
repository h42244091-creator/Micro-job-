import React, { useState, useMemo } from 'react';
import { useApp } from '../../context/AppContext';
import { Job, JobCategory, TargetRegion } from '../../types';
import { JobDetailModal } from './JobDetailModal';
import { 
  Search, 
  Filter, 
  Sparkles, 
  Clock, 
  Globe, 
  CheckCircle, 
  DollarSign, 
  Briefcase, 
  TrendingUp, 
  Award,
  ChevronRight,
  ShieldCheck,
  CheckCircle2
} from 'lucide-react';

const CATEGORIES: { label: string; value: JobCategory | 'all' }[] = [
  { label: 'সকল ক্যাটাগরি', value: 'all' },
  { label: 'YouTube', value: 'YouTube' },
  { label: 'ফেসবুক ও সোশ্যাল', value: 'Facebook & Social' },
  { label: 'অ্যাপ ইনস্টল', value: 'Mobile App Install' },
  { label: 'ওয়েব ও এসইও ভিজিট', value: 'SEO & Web Visit' },
  { label: 'সাইন আপ', value: 'Sign Up & Referral' },
  { label: 'টেলিগ্রাম', value: 'Telegram / Discord' },
];

export const WorkerJobFeed: React.FC = () => {
  const { jobs, currentUser, config, submissions } = useApp();

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<JobCategory | 'all'>('all');
  const [selectedRegion, setSelectedRegion] = useState<TargetRegion | 'all'>('all');
  const [sortBy, setSortBy] = useState<'highest_pay' | 'newest' | 'available'>('highest_pay');
  const [activeJobModal, setActiveJobModal] = useState<Job | null>(null);
  const [showSuccessToast, setShowSuccessToast] = useState(false);

  // Filter jobs
  const filteredJobs = useMemo(() => {
    return jobs.filter(job => {
      // Must be active
      if (job.status !== 'active') return false;

      // Category match
      if (selectedCategory !== 'all' && job.category !== selectedCategory) return false;

      // Region match
      if (selectedRegion !== 'all' && job.region !== selectedRegion && job.region !== 'International') return false;

      // Search match
      if (searchQuery.trim() !== '') {
        const query = searchQuery.toLowerCase();
        const matchesTitle = job.title.toLowerCase().includes(query);
        const matchesDesc = job.description.toLowerCase().includes(query);
        const matchesCat = job.category.toLowerCase().includes(query);
        if (!matchesTitle && !matchesDesc && !matchesCat) return false;
      }

      return true;
    }).sort((a, b) => {
      if (sortBy === 'highest_pay') return b.rewardPerWorker - a.rewardPerWorker;
      if (sortBy === 'newest') return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
      if (sortBy === 'available') return (b.totalWorkersNeeded - b.completedWorkers) - (a.totalWorkersNeeded - a.completedWorkers);
      return 0;
    });
  }, [jobs, selectedCategory, selectedRegion, searchQuery, sortBy]);

  // Check which jobs user already submitted
  const submittedJobIds = useMemo(() => {
    return new Set(submissions.filter(s => s.workerId === currentUser.id).map(s => s.jobId));
  }, [submissions, currentUser.id]);

  const handleJobSubmitSuccess = () => {
    setActiveJobModal(null);
    setShowSuccessToast(true);
    setTimeout(() => setShowSuccessToast(false), 4000);
  };

  return (
    <div className="space-y-6">
      
      {/* Worker Stats Bar */}
      <div className="bg-gradient-to-r from-emerald-900 via-slate-900 to-teal-900 rounded-3xl p-6 text-white shadow-xl relative overflow-hidden">
        <div className="absolute top-0 right-0 -mt-8 -mr-8 w-64 h-64 rounded-full bg-emerald-500/10 blur-3xl pointer-events-none" />
        
        <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-300 text-xs font-semibold mb-2 border border-emerald-500/30">
              <Sparkles className="w-3.5 h-3.5" />
              <span>সহজ টাস্ক পূরণ করে প্রতিদিন আয় করুন</span>
            </div>
            <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-white">
              হ্যালো, {currentUser.name}! আজ {filteredJobs.length}টি মাইক্রো জব পাওয়া যাচ্ছে
            </h1>
            <p className="text-xs sm:text-sm text-slate-300 mt-1 max-w-xl">
              নির্দেশনা অনুযায়ী কাজ সম্পন্ন করে সঠিক স্ক্রিনশট ও তথ্য জমা দিন। এমপ্লয়ার যাচাই করার পর সরাসরি ব্যালেন্সে টাকা যুক্ত হবে।
            </p>
          </div>

          <div className="grid grid-cols-3 gap-3 w-full md:w-auto shrink-0 bg-white/10 backdrop-blur-md p-3.5 rounded-2xl border border-white/10">
            <div className="text-center px-2">
              <span className="text-[10px] text-slate-300 uppercase block font-semibold">রেটিং</span>
              <span className="text-base sm:text-lg font-bold text-emerald-400">
                {currentUser.successRate}%
              </span>
            </div>
            <div className="text-center px-2 border-x border-white/10">
              <span className="text-[10px] text-slate-300 uppercase block font-semibold">পেন্ডিং</span>
              <span className="text-base sm:text-lg font-bold text-amber-400">
                ${currentUser.pendingBalance.toFixed(2)}
              </span>
            </div>
            <div className="text-center px-2">
              <span className="text-[10px] text-slate-300 uppercase block font-semibold">উইথড্রযোগ্য</span>
              <span className="text-base sm:text-lg font-bold text-white">
                ${currentUser.workerBalance.toFixed(2)}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Success Notification Banner */}
      {showSuccessToast && (
        <div className="bg-emerald-600 text-white px-4 py-3 rounded-2xl shadow-lg flex items-center justify-between animate-in slide-in-from-top-3">
          <div className="flex items-center gap-2 text-xs sm:text-sm font-semibold">
            <CheckCircle2 className="w-5 h-5" />
            <span>ধন্যবাদ! আপনার প্রুফ সফলভাবে জমা হয়েছে। এমপ্লয়ার রিভিউ করার পর পেমেন্ট অ্যাকাউন্টে যোগ হবে।</span>
          </div>
          <button 
            onClick={() => setShowSuccessToast(false)}
            className="text-xs font-bold underline ml-4 hover:opacity-80"
          >
            ঠিক আছে
          </button>
        </div>
      )}

      {/* Search and Filter Controls */}
      <div className="bg-white rounded-2xl p-4 shadow-xs border border-slate-200 space-y-3">
        
        {/* Search Row */}
        <div className="flex flex-col sm:flex-row items-center gap-3">
          <div className="relative flex-1 w-full">
            <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="কাজের নাম বা টপিক সার্চ করুন (যেমন: YouTube, Facebook, App, SEO)..."
              className="w-full pl-9 pr-4 py-2.5 rounded-xl border border-slate-200 text-xs sm:text-sm bg-slate-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500 transition-all"
            />
          </div>

          <div className="flex items-center gap-2 w-full sm:w-auto">
            {/* Region Filter */}
            <select
              value={selectedRegion}
              onChange={(e) => setSelectedRegion(e.target.value as any)}
              className="w-1/2 sm:w-auto px-3 py-2.5 rounded-xl border border-slate-200 text-xs font-medium bg-slate-50 text-slate-700 focus:outline-none focus:ring-2 focus:ring-emerald-500"
            >
              <option value="all">সকল দেশ / রিজিয়ন</option>
              <option value="Bangladesh">বাংলাদেশ শুধুমাত্র</option>
              <option value="Asia">এশিয়া</option>
              <option value="International">আন্তর্জাতিক (International)</option>
            </select>

            {/* Sort Filter */}
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as any)}
              className="w-1/2 sm:w-auto px-3 py-2.5 rounded-xl border border-slate-200 text-xs font-medium bg-slate-50 text-slate-700 focus:outline-none focus:ring-2 focus:ring-emerald-500"
            >
              <option value="highest_pay">সর্বোচ্চ পেমেন্ট আগে</option>
              <option value="newest">নতুন কাজ আগে</option>
              <option value="available">খালি স্লট বেশি</option>
            </select>
          </div>
        </div>

        {/* Category Pills */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none pt-1">
          {CATEGORIES.map(cat => (
            <button
              key={cat.value}
              onClick={() => setSelectedCategory(cat.value)}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all ${
                selectedCategory === cat.value
                  ? 'bg-slate-900 text-white shadow-xs'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200 hover:text-slate-900'
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>
      </div>

      {/* Jobs Feed Grid */}
      <div className="space-y-3">
        <div className="flex items-center justify-between text-xs text-slate-500 px-1">
          <span>মোট পাওয়া গেছে: <strong className="text-slate-900">{filteredJobs.length}টি</strong> মাইক্রো জব</span>
          <span className="flex items-center gap-1 text-emerald-700">
            <ShieldCheck className="w-3.5 h-3.5" />
            ১০০% নিরাপদ এসক্রো পেমেন্ট
          </span>
        </div>

        {filteredJobs.length === 0 ? (
          <div className="bg-white rounded-3xl p-12 text-center border border-slate-200">
            <Briefcase className="w-10 h-10 text-slate-300 mx-auto mb-3" />
            <h3 className="text-base font-bold text-slate-700">কোনো কাজ খুঁজে পাওয়া যায়নি!</h3>
            <p className="text-xs text-slate-500 mt-1">
              অন্য কোনো ক্যাটাগরি বা ফিল্টার নির্বাচন করে পুনরায় চেষ্টা করুন।
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
            {filteredJobs.map(job => {
              const isAlreadyDone = submittedJobIds.has(job.id);
              const progressPct = Math.min(100, Math.round((job.completedWorkers / job.totalWorkersNeeded) * 100));

              return (
                <div
                  key={job.id}
                  id={`job-card-${job.id}`}
                  className="bg-white rounded-2xl p-4 sm:p-5 border border-slate-200 hover:border-emerald-300 hover:shadow-md transition-all flex flex-col justify-between gap-3 relative group"
                >
                  {job.isFeatured && (
                    <div className="absolute top-3 right-3 bg-amber-100 text-amber-900 font-bold text-[10px] px-2 py-0.5 rounded-full border border-amber-200 flex items-center gap-1">
                      <Sparkles className="w-3 h-3 text-amber-600" />
                      ফিচারড
                    </div>
                  )}

                  <div>
                    {/* Category & Region */}
                    <div className="flex items-center gap-2 mb-2">
                      <span className="text-[11px] font-bold px-2 py-0.5 rounded-md bg-emerald-50 text-emerald-700 border border-emerald-100">
                        {job.category}
                      </span>
                      <span className="text-[11px] text-slate-500 flex items-center gap-1">
                        <Globe className="w-3 h-3" />
                        {job.region}
                      </span>
                      <span className="text-[11px] text-slate-400">
                        • {job.estimatedMinutes} মিনিট
                      </span>
                    </div>

                    {/* Job Title */}
                    <h3 className="text-sm sm:text-base font-bold text-slate-900 group-hover:text-emerald-700 transition-colors line-clamp-2 leading-snug">
                      {job.title}
                    </h3>

                    {/* Description preview */}
                    <p className="text-xs text-slate-500 mt-1.5 line-clamp-2 leading-relaxed">
                      {job.description}
                    </p>
                  </div>

                  {/* Worker Progress Bar */}
                  <div className="space-y-1.5 pt-2 border-t border-slate-100">
                    <div className="flex items-center justify-between text-[11px] text-slate-500">
                      <span>সম্পন্ন: {job.completedWorkers} / {job.totalWorkersNeeded}</span>
                      <span className="font-semibold text-slate-700">{progressPct}%</span>
                    </div>
                    <div className="w-full h-1.5 bg-slate-100 rounded-full overflow-hidden">
                      <div 
                        className="h-full bg-emerald-500 rounded-full transition-all duration-500"
                        style={{ width: `${progressPct}%` }}
                      />
                    </div>
                  </div>

                  {/* Bottom Reward & Apply Button */}
                  <div className="flex items-center justify-between gap-3 pt-1">
                    <div>
                      <div className="text-xs text-slate-400">পেমেন্ট</div>
                      <div className="text-base font-extrabold text-slate-900 flex items-baseline gap-1">
                        ${job.rewardPerWorker.toFixed(2)}
                        <span className="text-[11px] font-medium text-emerald-700">
                          (৳{(job.rewardPerWorker * config.dollarRateInBDT).toFixed(0)})
                        </span>
                      </div>
                    </div>

                    {isAlreadyDone ? (
                      <span className="px-3.5 py-2 rounded-xl bg-slate-100 text-slate-500 text-xs font-semibold flex items-center gap-1.5">
                        <CheckCircle className="w-3.5 h-3.5 text-emerald-600" />
                        জমা দিয়েছেন
                      </span>
                    ) : (
                      <button
                        onClick={() => setActiveJobModal(job)}
                        className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold shadow-sm shadow-emerald-200 flex items-center gap-1 transition-all group-hover:translate-x-0.5"
                      >
                        <span>কাজটি শুরু করুন</span>
                        <ChevronRight className="w-3.5 h-3.5" />
                      </button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Modal instance */}
      {activeJobModal && (
        <JobDetailModal
          job={activeJobModal}
          onClose={() => setActiveJobModal(null)}
          onSuccess={handleJobSubmitSuccess}
        />
      )}

    </div>
  );
};
