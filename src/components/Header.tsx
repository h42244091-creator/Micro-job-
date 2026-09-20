import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { 
  Briefcase, 
  Wallet, 
  User, 
  PlusCircle, 
  CheckCircle2, 
  Sparkles, 
  DollarSign, 
  Menu, 
  X, 
  Users, 
  FolderKanban, 
  ArrowDownLeft, 
  Send,
  ChevronDown,
  Globe
} from 'lucide-react';
import { NavTab } from '../types';
import { PublishGuideModal } from './PublishGuideModal';

export const Header: React.FC = () => {
  const { 
    currentUser, 
    config, 
    activeTab, 
    setActiveTab, 
    submissions 
  } = useApp();

  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [profileDropdownOpen, setProfileDropdownOpen] = useState(false);
  const [publishGuideOpen, setPublishGuideOpen] = useState(false);

  // Count pending reviews for jobs this user posted
  const pendingReviewsCount = submissions.filter(
    s => s.employerId === currentUser.id && s.status === 'pending'
  ).length;

  const handleNavClick = (tab: NavTab) => {
    setActiveTab(tab);
    setMobileMenuOpen(false);
  };

  const navItems: { id: NavTab; label: string; icon: React.ReactNode; badge?: number | string }[] = [
    {
      id: 'browse_jobs',
      label: 'কাজ খুঁজুন (Browse Jobs)',
      icon: <Briefcase className="w-4 h-4" />
    },
    {
      id: 'post_job',
      label: 'জব পোস্ট করুন (Post Job)',
      icon: <PlusCircle className="w-4 h-4 text-emerald-500" />
    },
    {
      id: 'add_money',
      label: 'এড মানি (Add Money)',
      icon: <ArrowDownLeft className="w-4 h-4 text-blue-400" />,
      badge: 'বিকাশ/নগদ'
    },
    {
      id: 'wallet',
      label: 'উইথড্রয়াল (Cashout)',
      icon: <Wallet className="w-4 h-4 text-amber-400" />
    },
    {
      id: 'my_tasks',
      label: 'আমার জমা কাজ (My Tasks)',
      icon: <CheckCircle2 className="w-4 h-4" />
    },
    {
      id: 'manage_jobs',
      label: 'পোস্ট করা জব ও প্রুফ',
      icon: <FolderKanban className="w-4 h-4" />,
      badge: pendingReviewsCount > 0 ? pendingReviewsCount : undefined
    },
    {
      id: 'referrals',
      label: 'রেফারেল সিস্টেম (৫%)',
      icon: <Users className="w-4 h-4 text-purple-400" />,
      badge: 'আজীবন ৫%'
    }
  ];

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-200/80 shadow-xs">
      
      {/* Top Notice Bar */}
      {config.announcement && (
        <aside aria-label="Announcement" className="bg-slate-900 text-slate-200 text-xs py-1.5 px-4 border-b border-slate-800">
          <div className="max-w-7xl mx-auto flex items-center justify-between gap-4">
            <div className="flex items-center gap-2 truncate">
              <span className="bg-emerald-500 text-slate-950 font-bold px-1.5 py-0.5 rounded-md text-[10px] tracking-wide">
                নোটিশ
              </span>
              <span className="text-slate-300 truncate text-[11px]">
                {config.announcement}
              </span>
            </div>
            <div className="hidden sm:flex items-center gap-3 text-[11px] text-slate-400 shrink-0">
              <span className="text-emerald-400 font-semibold">১ USD = ৳{config.dollarRateInBDT} BDT</span>
              <span>•</span>
              <span className="text-purple-300 font-semibold">রেফারেল বোনাস ৫%</span>
            </div>
          </div>
        </aside>
      )}

      {/* Main Bar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 gap-4">
          
          {/* Logo Branding */}
          <div 
            onClick={() => setActiveTab('browse_jobs')}
            className="flex items-center gap-2.5 cursor-pointer select-none group"
          >
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-emerald-600 via-teal-600 to-indigo-600 flex items-center justify-center text-white shadow-md shadow-emerald-500/20 group-hover:scale-105 transition-transform">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="font-extrabold text-slate-900 text-base sm:text-lg tracking-tight">
                  MicroJob<span className="text-emerald-600">Pro</span>
                </span>
                <span className="hidden sm:inline-block px-1.5 py-0.5 rounded-md bg-emerald-50 text-emerald-700 text-[10px] font-bold border border-emerald-200">
                  বাংলাদেশ
                </span>
              </div>
              <p className="text-[11px] text-slate-500 leading-none">
                কাজ করুন • জব পোস্ট করুন • রেফার করে আয়
              </p>
            </div>
          </div>

          {/* Desktop Balance Pills */}
          <div className="hidden md:flex items-center gap-3">
            
            {/* Worker Earning Balance */}
            <div 
              onClick={() => setActiveTab('wallet')}
              className="flex items-center gap-2.5 px-3.5 py-1.5 rounded-2xl bg-emerald-50/70 border border-emerald-200/80 cursor-pointer hover:bg-emerald-100/70 transition-colors"
              title="আপনার আর্নিং ব্যালেন্স - টাকা তুলতে ক্লিক করুন"
            >
              <div className="w-7 h-7 rounded-xl bg-emerald-600 text-white flex items-center justify-center shadow-xs">
                <Wallet className="w-4 h-4" />
              </div>
              <div className="text-left">
                <span className="text-[10px] font-bold text-emerald-800 uppercase tracking-wider block">
                  আর্নিং ব্যালেন্স
                </span>
                <div className="font-extrabold text-slate-900 text-xs">
                  ${currentUser.workerBalance.toFixed(2)} USD 
                  <span className="text-[10px] text-emerald-700 font-bold ml-1">
                    (৳{(currentUser.workerBalance * config.dollarRateInBDT).toFixed(0)})
                  </span>
                </div>
              </div>
            </div>

            {/* Employer Deposit Balance */}
            <div 
              onClick={() => setActiveTab('add_money')}
              className="flex items-center gap-2.5 px-3.5 py-1.5 rounded-2xl bg-blue-50/70 border border-blue-200/80 cursor-pointer hover:bg-blue-100/70 transition-colors"
              title="জব পোস্টিং ডিপোজিট ব্যালেন্স - রিচার্জ করতে ক্লিক করুন"
            >
              <div className="w-7 h-7 rounded-xl bg-blue-600 text-white flex items-center justify-center shadow-xs">
                <DollarSign className="w-4 h-4" />
              </div>
              <div className="text-left">
                <span className="text-[10px] font-bold text-blue-800 uppercase tracking-wider block">
                  ডিপোজিট ব্যালেন্স
                </span>
                <div className="font-extrabold text-slate-900 text-xs">
                  ${currentUser.employerBalance.toFixed(2)} USD
                  <span className="text-[10px] text-blue-700 font-bold ml-1">
                    (৳{(currentUser.employerBalance * config.dollarRateInBDT).toFixed(0)})
                  </span>
                </div>
              </div>
            </div>

            {/* Prominent Add Money Button */}
            <button
              id="btn-nav-add-money"
              onClick={() => setActiveTab('add_money')}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-2xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold shadow-xs transition-colors cursor-pointer"
              title="বিকাশ, নগদ বা রকেটে ব্যালেন্স রিচার্জ করুন"
            >
              <ArrowDownLeft className="w-3.5 h-3.5" />
              <span>+ এড মানি</span>
            </button>

          </div>

          {/* User Profile Info & Mobile Toggle */}
          <div className="flex items-center gap-2 sm:gap-3">
            
            {/* Quick Publish Guide Button */}
            <button
              id="btn-nav-publish-guide"
              onClick={() => setPublishGuideOpen(true)}
              className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-2xl bg-indigo-50 hover:bg-indigo-100 text-indigo-800 text-xs font-bold border border-indigo-200 transition-colors cursor-pointer"
              title="কীভাবে এই ওয়েবসাইট ইন্টারনেটে লাইভ ও পাবলিশ করবেন?"
            >
              <Globe className="w-3.5 h-3.5 text-indigo-600" />
              <span>পাবলিশ গাইড</span>
            </button>

            {/* Quick Referral Link Button */}
            <button
              id="btn-nav-referral"
              onClick={() => setActiveTab('referrals')}
              className="hidden lg:flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-gradient-to-r from-purple-500 to-indigo-600 text-white text-xs font-bold shadow-xs hover:opacity-95 transition-opacity"
            >
              <Users className="w-3.5 h-3.5" />
              <span>রেফারেল (${currentUser.referralEarnings.toFixed(2)})</span>
            </button>

            {/* User Profile Avatar */}
            <div className="relative">
              <button
                onClick={() => setProfileDropdownOpen(!profileDropdownOpen)}
                className="flex items-center gap-2 p-1.5 rounded-2xl hover:bg-slate-100 transition-colors border border-slate-200/80"
              >
                <img 
                  src={currentUser.avatar} 
                  alt={currentUser.name} 
                  className="w-8 h-8 rounded-xl object-cover"
                />
                <div className="hidden sm:block text-left text-xs leading-tight pr-1">
                  <span className="font-bold text-slate-800 block truncate max-w-[110px]">
                    {currentUser.name}
                  </span>
                  <span className="text-[10px] font-semibold text-emerald-600">
                    সাকসেস: {currentUser.successRate}%
                  </span>
                </div>
                <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
              </button>

              {/* Profile Dropdown */}
              {profileDropdownOpen && (
                <div 
                  onClick={() => setProfileDropdownOpen(false)}
                  className="absolute right-0 mt-2 w-56 bg-white rounded-2xl shadow-xl border border-slate-200 p-2 z-50 text-xs text-slate-700 animate-in fade-in zoom-in-95"
                >
                  <div className="p-2 border-b border-slate-100">
                    <span className="font-bold text-slate-900 block">{currentUser.name}</span>
                    <span className="text-[11px] text-slate-400 block">{currentUser.email}</span>
                    <span className="text-[10px] text-purple-600 font-mono mt-0.5 block font-bold">
                      রেফার কোড: {currentUser.referralCode}
                    </span>
                  </div>

                  <div className="py-1 space-y-0.5">
                    <button
                      onClick={() => setActiveTab('wallet')}
                      className="w-full text-left px-3 py-2 rounded-xl hover:bg-slate-50 font-semibold flex items-center justify-between"
                    >
                      <span>উইথড্রয়াল ওয়ালেট</span>
                      <span className="font-bold text-emerald-600">${currentUser.workerBalance.toFixed(2)}</span>
                    </button>
                    <button
                      onClick={() => setActiveTab('add_money')}
                      className="w-full text-left px-3 py-2 rounded-xl hover:bg-slate-50 font-semibold flex items-center justify-between"
                    >
                      <span>এড মানি / ডিপোজিট</span>
                      <span className="font-bold text-blue-600">${currentUser.employerBalance.toFixed(2)}</span>
                    </button>
                    <button
                      onClick={() => setActiveTab('referrals')}
                      className="w-full text-left px-3 py-2 rounded-xl hover:bg-slate-50 font-semibold flex items-center justify-between text-purple-700"
                    >
                      <span>রেফারেল বোনাস</span>
                      <span className="font-bold">${currentUser.referralEarnings.toFixed(2)}</span>
                    </button>
                    <button
                      onClick={() => setPublishGuideOpen(true)}
                      className="w-full text-left px-3 py-2 rounded-xl hover:bg-indigo-50 font-semibold flex items-center justify-between text-indigo-700 border-t border-slate-100 mt-1 pt-1.5"
                    >
                      <span>সাইট পাবলিশ গাইড</span>
                      <Globe className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* Mobile Hamburger Button */}
            <button
              id="btn-mobile-menu-toggle"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="lg:hidden p-2 rounded-xl border border-slate-200 text-slate-700 hover:bg-slate-100"
              aria-label="Toggle Menu"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>

          </div>

        </div>
      </div>

      {/* Unique Desktop Menu Bar */}
      <nav className="hidden lg:block bg-slate-900 text-white border-t border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between py-1">
            
            <div className="flex items-center gap-1 overflow-x-auto">
              {navItems.map((item) => {
                const isActive = activeTab === item.id;
                return (
                  <button
                    key={item.id}
                    id={`menu-item-${item.id}`}
                    onClick={() => handleNavClick(item.id)}
                    className={`flex items-center gap-2 px-3.5 py-2.5 rounded-xl text-xs font-bold transition-all whitespace-nowrap relative ${
                      isActive 
                        ? 'bg-emerald-500 text-slate-950 shadow-sm' 
                        : 'text-slate-300 hover:text-white hover:bg-slate-800'
                    }`}
                  >
                    {item.icon}
                    <span>{item.label}</span>
                    {item.badge && (
                      <span className={`ml-1 text-[10px] font-extrabold px-1.5 py-0.2 rounded-full ${
                        isActive 
                          ? 'bg-slate-950 text-white' 
                          : 'bg-amber-400 text-slate-950'
                      }`}>
                        {item.badge}
                      </span>
                    )}
                  </button>
                );
              })}
            </div>

            {/* Fast Post Job Call to Action on Menu Bar */}
            <button
              id="menu-post-job-cta"
              onClick={() => setActiveTab('post_job')}
              className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-500 text-slate-950 text-xs font-extrabold shadow-sm hover:opacity-90 transition-opacity"
            >
              <PlusCircle className="w-3.5 h-3.5" />
              <span>+ কাজ পোস্ট করুন</span>
            </button>

          </div>
        </div>
      </nav>

      {/* Mobile Drawer Menu Bar */}
      {mobileMenuOpen && (
        <div className="lg:hidden bg-white border-t border-slate-200 p-4 space-y-3 animate-in slide-in-from-top-3">
          
          {/* Mobile Balance display */}
          <div className="grid grid-cols-2 gap-2 bg-slate-50 p-3 rounded-2xl border border-slate-200 text-xs">
            <div>
              <span className="text-[10px] text-slate-500 font-bold block">আর্নিং ব্যালেন্স</span>
              <span className="font-extrabold text-emerald-700 text-sm">
                ${currentUser.workerBalance.toFixed(2)}
              </span>
              <span className="text-[10px] text-slate-400 block">
                ৳{(currentUser.workerBalance * config.dollarRateInBDT).toFixed(0)} BDT
              </span>
            </div>
            <div>
              <span className="text-[10px] text-slate-500 font-bold block">ডিপোজিট ব্যালেন্স</span>
              <span className="font-extrabold text-blue-700 text-sm">
                ${currentUser.employerBalance.toFixed(2)}
              </span>
              <span className="text-[10px] text-slate-400 block">
                ৳{(currentUser.employerBalance * config.dollarRateInBDT).toFixed(0)} BDT
              </span>
            </div>
          </div>

          {/* Menu Items List */}
          <div className="space-y-1">
            {navItems.map((item) => {
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => handleNavClick(item.id)}
                  className={`w-full flex items-center justify-between px-4 py-2.5 rounded-xl text-xs font-bold transition-all ${
                    isActive 
                      ? 'bg-emerald-600 text-white' 
                      : 'text-slate-700 hover:bg-slate-100'
                  }`}
                >
                  <div className="flex items-center gap-2.5">
                    {item.icon}
                    <span>{item.label}</span>
                  </div>
                  {item.badge && (
                    <span className={`text-[10px] font-extrabold px-2 py-0.5 rounded-full ${
                      isActive ? 'bg-white text-emerald-700' : 'bg-amber-100 text-amber-800'
                    }`}>
                      {item.badge}
                    </span>
                  )}
                </button>
              );
            })}
          </div>

        </div>
      )}

      {/* Deployment & Publish Guide Modal */}
      <PublishGuideModal
        isOpen={publishGuideOpen}
        onClose={() => setPublishGuideOpen(false)}
      />

    </header>
  );
};
