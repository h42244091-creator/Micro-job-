import React from 'react';
import { AppProvider, useApp } from './context/AppContext';
import { Header } from './components/Header';
import { WorkerJobFeed } from './components/worker/WorkerJobFeed';
import { WorkerTasks } from './components/worker/WorkerTasks';
import { EmployerManageJobs } from './components/employer/EmployerManageJobs';
import { EmployerPostJob } from './components/employer/EmployerPostJob';
import { UnifiedWallet } from './components/wallet/UnifiedWallet';
import { ReferralSystem } from './components/referral/ReferralSystem';
import { 
  Briefcase, 
  PlusCircle, 
  Layers, 
  CheckCircle2, 
  Wallet, 
  Users, 
  ShieldCheck, 
  Sparkles,
  ArrowUpRight,
  TrendingUp,
  Award
} from 'lucide-react';

const MainAppContent: React.FC = () => {
  const { activeTab, setActiveTab, config, currentUser, jobs, submissions } = useApp();

  const myPostedCount = jobs.filter(j => j.employerId === currentUser.id).length;
  const mySubmittedCount = submissions.filter(s => s.workerId === currentUser.id).length;

  return (
    <div className="min-h-screen bg-slate-100/70 flex flex-col font-sans selection:bg-emerald-500 selection:text-white">
      {/* Top Header with Persistent Navigation Bar */}
      <Header />

      {/* Main Container View */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6">
        
        {/* Render View based on activeTab */}
        {activeTab === 'browse_jobs' && <WorkerJobFeed />}
        
        {activeTab === 'post_job' && (
          <EmployerPostJob 
            onSuccess={() => setActiveTab('manage_jobs')}
            onGoDeposit={() => setActiveTab('add_money')}
          />
        )}
        
        {activeTab === 'manage_jobs' && <EmployerManageJobs />}
        
        {activeTab === 'my_tasks' && <WorkerTasks />}
        
        {activeTab === 'wallet' && <UnifiedWallet initialTab="withdraw" />}

        {(activeTab === 'add_money' || activeTab === 'deposit') && <UnifiedWallet initialTab="deposit" />}
        
        {activeTab === 'referrals' && <ReferralSystem />}

      </main>

      {/* Modern High-End User Platform Footer */}
      <footer className="bg-white border-t border-slate-200 mt-auto py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 pb-6 border-b border-slate-100 text-xs text-slate-500">
            
            <div className="space-y-2">
              <div className="flex items-center gap-2 font-bold text-slate-900 text-sm">
                <div className="w-6 h-6 rounded-lg bg-emerald-600 text-white flex items-center justify-center">
                  <Briefcase className="w-3.5 h-3.5" />
                </div>
                <span>MicroJob Pro</span>
              </div>
              <p className="leading-relaxed">
                বাংলাদেশের বিশ্বস্ত ও আধুনিক মাইক্রো জব প্ল্যাটফর্ম। যে কেউ কাজ করে আয় করতে পারেন এবং যেকোনো প্রচারমূলক কাজ পোস্ট করতে পারেন।
              </p>
            </div>

            <div className="space-y-1.5">
              <h4 className="font-bold text-slate-800 uppercase text-[11px] tracking-wider">
                ইউজার অপশন
              </h4>
              <ul className="space-y-1">
                <li>
                  <button 
                    onClick={() => setActiveTab('browse_jobs')} 
                    className="hover:text-emerald-700 transition-colors"
                  >
                    মাইক্রো জব ব্রাউজ করুন
                  </button>
                </li>
                <li>
                  <button 
                    onClick={() => setActiveTab('my_tasks')} 
                    className="hover:text-emerald-700 transition-colors"
                  >
                    আমার জমা দেওয়া কাজ ({mySubmittedCount})
                  </button>
                </li>
                <li>
                  <button 
                    onClick={() => setActiveTab('wallet')} 
                    className="hover:text-emerald-700 transition-colors"
                  >
                    আর্নিং ওয়ালেট ও উইথড্র
                  </button>
                </li>
              </ul>
            </div>

            <div className="space-y-1.5">
              <h4 className="font-bold text-slate-800 uppercase text-[11px] tracking-wider">
                এমপ্লয়ার সার্ভিস
              </h4>
              <ul className="space-y-1">
                <li>
                  <button 
                    onClick={() => setActiveTab('post_job')} 
                    className="hover:text-emerald-700 transition-colors"
                  >
                    নতুন মাইক্রো জব পোস্ট করুন
                  </button>
                </li>
                <li>
                  <button 
                    onClick={() => setActiveTab('manage_jobs')} 
                    className="hover:text-emerald-700 transition-colors"
                  >
                    পোস্ট করা কাজ ও রিভিউ ({myPostedCount})
                  </button>
                </li>
                <li>
                  <button 
                    onClick={() => setActiveTab('wallet')} 
                    className="hover:text-emerald-700 transition-colors"
                  >
                    ডিপোজিট ও এসক্রো ফান্ড
                  </button>
                </li>
              </ul>
            </div>

            <div className="space-y-2">
              <h4 className="font-bold text-slate-800 uppercase text-[11px] tracking-wider">
                রেফারেল ও সুবিধা
              </h4>
              <p className="leading-relaxed">
                বন্ধুদের রেফার করে আজীবনের জন্য {config.referralCommissionPercent}% কমিশন আয় করুন।
              </p>
              <button
                onClick={() => setActiveTab('referrals')}
                className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-purple-50 text-purple-700 font-bold text-xs border border-purple-200 hover:bg-purple-100 transition-colors"
              >
                <Users className="w-3.5 h-3.5 text-purple-600" />
                <span>রেফারেল ড্যাশবোর্ড খুলুন</span>
              </button>
            </div>

          </div>

          <div className="pt-4 flex flex-col sm:flex-row items-center justify-between gap-2 text-[11px] text-slate-400">
            <div>
              © 2026 MicroJob Platform. সর্বস্বত্ব সংরক্ষিত।
            </div>
            <div className="flex items-center gap-4">
              <span>মুদ্রা রেট: ১ USD = ৳{config.dollarRateInBDT} BDT</span>
              <span>•</span>
              <span>প্ল্যাটফর্ম কমিশন: {config.platformFeePercent}%</span>
              <span>•</span>
              <span>রেফারেল বোনাস: {config.referralCommissionPercent}%</span>
            </div>
          </div>
        </div>
      </footer>

    </div>
  );
};

export default function App() {
  return (
    <AppProvider>
      <MainAppContent />
    </AppProvider>
  );
}
