import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { 
  Users, 
  Copy, 
  Check, 
  Share2, 
  Gift, 
  DollarSign, 
  Sparkles, 
  TrendingUp, 
  MessageCircle, 
  Send, 
  CheckCircle2, 
  ArrowRight,
  ShieldCheck,
  UserPlus
} from 'lucide-react';

export const ReferralSystem: React.FC = () => {
  const { currentUser, config, claimReferralEarnings, simulateNewReferral } = useApp();

  const [copied, setCopied] = useState(false);
  const [testFriendName, setTestFriendName] = useState('');
  const [claimToast, setClaimToast] = useState('');

  // Referral link
  const origin = typeof window !== 'undefined' ? window.location.origin : 'https://microjob.pro';
  const referralLink = `${origin}/?ref=${currentUser.referralCode}`;

  const copyLink = () => {
    navigator.clipboard.writeText(referralLink);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleClaim = () => {
    const res = claimReferralEarnings();
    setClaimToast(res.message);
    setTimeout(() => setClaimToast(''), 3500);
  };

  const handleSimulate = (e: React.FormEvent) => {
    e.preventDefault();
    if (!testFriendName.trim()) return;
    simulateNewReferral(testFriendName.trim());
    setTestFriendName('');
  };

  // Social share URLs
  const shareText = encodeURIComponent(`মাইক্রো জব করে প্রতিদিন ঘরে বসে আয় করুন! আমার রেফারেল লিংকে জয়েন করুন: ${referralLink}`);
  const whatsappUrl = `https://api.whatsapp.com/send?text=${shareText}`;
  const telegramUrl = `https://t.me/share/url?url=${encodeURIComponent(referralLink)}&text=${shareText}`;
  const facebookUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(referralLink)}`;

  const totalEarningsBDT = (currentUser.referralEarnings * config.dollarRateInBDT).toFixed(0);

  return (
    <div className="space-y-6">
      
      {/* Toast Notification */}
      {claimToast && (
        <div className="bg-emerald-600 text-white p-4 rounded-2xl shadow-lg flex items-center gap-3 animate-in fade-in slide-in-from-top-2 text-xs sm:text-sm font-bold">
          <CheckCircle2 className="w-5 h-5 shrink-0" />
          <span>{claimToast}</span>
        </div>
      )}

      {/* Hero Banner: Unique Referral Program */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-indigo-900 via-purple-900 to-slate-900 text-white p-6 sm:p-8 shadow-xl border border-white/10">
        
        {/* Background ambient accents */}
        <div className="absolute -right-10 -bottom-10 w-64 h-64 bg-purple-500/20 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute left-1/3 -top-10 w-48 h-48 bg-emerald-500/15 rounded-full blur-2xl pointer-events-none" />

        <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
          
          <div className="lg:col-span-8 space-y-3">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-400/20 text-amber-300 text-xs font-extrabold border border-amber-400/30">
              <Sparkles className="w-3.5 h-3.5 text-amber-400" />
              <span>লাইফটাইম {config.referralCommissionPercent}% প্যাসিভ আর্নিং প্রোগ্রাম</span>
            </div>

            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight leading-tight">
              বন্ধুদের রেফার করুন, <br className="hidden sm:inline" />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-300 via-emerald-300 to-teal-200">
                প্রতিটি কাজ থেকে আজীবন ৫% কমিশন পান!
              </span>
            </h1>

            <p className="text-xs sm:text-sm text-purple-100/90 leading-relaxed max-w-xl">
              আপনার দেওয়া রেফারেল লিংক দিয়ে কেউ রেজিস্ট্রেশন করলে, তারা যত কাজ সম্পন্ন করবে বা ডিপোজিট করবে তার প্রতিটিতে আপনি স্বয়ংক্রিয়ভাবে কমিশন পাবেন। কোনো লিমিট নেই!
            </p>

            {/* Unique Referral Link Bar */}
            <div className="pt-2 max-w-xl">
              <span className="text-[11px] font-bold text-purple-200 uppercase tracking-wider block mb-1.5">
                আপনার ব্যক্তিগত রেফারেল লিংক (Unique Invite Link)
              </span>
              <div className="flex items-center gap-2 bg-slate-950/70 backdrop-blur-md p-2 rounded-2xl border border-white/20">
                <div className="px-3 py-1 bg-white/10 rounded-xl font-mono text-xs font-bold text-amber-300 truncate flex-1">
                  {referralLink}
                </div>
                <button
                  id="btn-copy-ref-link"
                  onClick={copyLink}
                  className="px-4 py-2 bg-emerald-500 hover:bg-emerald-400 text-slate-950 text-xs font-extrabold rounded-xl transition-all flex items-center gap-1.5 shrink-0 shadow-md shadow-emerald-500/20"
                >
                  {copied ? <Check className="w-4 h-4 text-emerald-950" /> : <Copy className="w-4 h-4" />}
                  <span>{copied ? 'কপি হয়েছে!' : 'লিংক কপি'}</span>
                </button>
              </div>
            </div>

            {/* Quick Share Buttons */}
            <div className="flex flex-wrap items-center gap-2 pt-1">
              <span className="text-xs text-purple-200 mr-1">সরাসরি শেয়ার করুন:</span>
              
              <a
                href={whatsappUrl}
                target="_blank"
                rel="noreferrer"
                className="px-3 py-1.5 rounded-xl bg-emerald-600/80 hover:bg-emerald-600 text-white text-xs font-semibold flex items-center gap-1.5 transition-colors"
              >
                <MessageCircle className="w-3.5 h-3.5" />
                <span>WhatsApp</span>
              </a>

              <a
                href={facebookUrl}
                target="_blank"
                rel="noreferrer"
                className="px-3 py-1.5 rounded-xl bg-blue-600/80 hover:bg-blue-600 text-white text-xs font-semibold flex items-center gap-1.5 transition-colors"
              >
                <Share2 className="w-3.5 h-3.5" />
                <span>Facebook</span>
              </a>

              <a
                href={telegramUrl}
                target="_blank"
                rel="noreferrer"
                className="px-3 py-1.5 rounded-xl bg-sky-600/80 hover:bg-sky-600 text-white text-xs font-semibold flex items-center gap-1.5 transition-colors"
              >
                <Send className="w-3.5 h-3.5" />
                <span>Telegram</span>
              </a>
            </div>

          </div>

          {/* Referral Reward Balance Card */}
          <div className="lg:col-span-4 bg-white/10 backdrop-blur-md rounded-3xl p-6 border border-white/20 text-center space-y-3">
            <div className="w-12 h-12 rounded-2xl bg-amber-400/20 text-amber-300 flex items-center justify-center mx-auto">
              <Gift className="w-6 h-6" />
            </div>

            <div>
              <span className="text-xs font-semibold text-purple-200">উপলব্ধ রেফারেল বোনাস</span>
              <div className="text-3xl font-extrabold text-white mt-0.5">
                ${currentUser.referralEarnings.toFixed(2)} USD
              </div>
              <span className="text-xs font-bold text-amber-300">
                (৳{totalEarningsBDT} BDT)
              </span>
            </div>

            <button
              id="btn-claim-referral"
              onClick={handleClaim}
              disabled={currentUser.referralEarnings <= 0}
              className={`w-full py-2.5 rounded-xl font-bold text-xs flex items-center justify-center gap-1.5 transition-all ${
                currentUser.referralEarnings > 0
                  ? 'bg-amber-400 hover:bg-amber-300 text-slate-950 shadow-md shadow-amber-400/20'
                  : 'bg-white/10 text-white/40 cursor-not-allowed'
              }`}
            >
              <DollarSign className="w-4 h-4" />
              <span>মূল আর্নিং ওয়ালেটে নিন (Claim)</span>
            </button>

            <span className="text-[11px] text-purple-200 block">
              রেফারেল কোড: <strong className="font-mono text-amber-300">{currentUser.referralCode}</strong>
            </span>
          </div>

        </div>

      </div>

      {/* Referral Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        
        <div className="bg-white rounded-3xl p-5 border border-slate-200 shadow-xs flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-purple-50 text-purple-700 flex items-center justify-center shrink-0">
            <Users className="w-6 h-6" />
          </div>
          <div>
            <span className="text-xs text-slate-500 font-semibold block">মোট রেফারেল সংখ্যা</span>
            <span className="text-2xl font-extrabold text-slate-900">
              {currentUser.referredUsers.length} জন
            </span>
            <span className="text-[11px] text-emerald-600 font-bold block mt-0.5">সক্রিয় মেম্বার</span>
          </div>
        </div>

        <div className="bg-white rounded-3xl p-5 border border-slate-200 shadow-xs flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-emerald-50 text-emerald-700 flex items-center justify-center shrink-0">
            <TrendingUp className="w-6 h-6" />
          </div>
          <div>
            <span className="text-xs text-slate-500 font-semibold block">সম্পন্ন মোট কাজ</span>
            <span className="text-2xl font-extrabold text-slate-900">
              {currentUser.referredUsers.reduce((acc, r) => acc + r.tasksCompleted, 0)} টি
            </span>
            <span className="text-[11px] text-slate-400 block mt-0.5">রেফার করা বন্ধুদের থেকে</span>
          </div>
        </div>

        <div className="bg-white rounded-3xl p-5 border border-slate-200 shadow-xs flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-amber-50 text-amber-700 flex items-center justify-center shrink-0">
            <Gift className="w-6 h-6" />
          </div>
          <div>
            <span className="text-xs text-slate-500 font-semibold block">কমিশন রেট</span>
            <span className="text-2xl font-extrabold text-slate-900">
              {config.referralCommissionPercent}%
            </span>
            <span className="text-[11px] text-purple-600 font-bold block mt-0.5">লাইফটাইম প্রযোজ্য</span>
          </div>
        </div>

      </div>

      {/* Two Column Layout: How it works & Simulate Invite */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* How It Works */}
        <div className="lg:col-span-7 bg-white rounded-3xl p-6 border border-slate-200 shadow-xs space-y-4">
          <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
            <ShieldCheck className="w-5 h-5 text-emerald-600" />
            <span>রেফারেল সিস্টেম কিভাবে কাজ করে?</span>
          </h3>

          <div className="space-y-4 pt-1">
            <div className="flex gap-3.5">
              <div className="w-8 h-8 rounded-full bg-purple-100 text-purple-800 font-extrabold flex items-center justify-center text-xs shrink-0">
                ১
              </div>
              <div className="text-xs">
                <strong className="text-slate-900 text-sm block mb-0.5">আপনার লিংক বন্ধুদের শেয়ার করুন</strong>
                <p className="text-slate-500 leading-relaxed">
                  Facebook, WhatsApp, Telegram বা যেকোনো গ্রুপে আপনার ব্যক্তিগত লিংক শেয়ার করুন। বন্ধু লিংকে ক্লিক করে অ্যাকাউন্ট খুললে আপনার রেফারেল হিসেবে যুক্ত হবে।
                </p>
              </div>
            </div>

            <div className="flex gap-3.5">
              <div className="w-8 h-8 rounded-full bg-blue-100 text-blue-800 font-extrabold flex items-center justify-center text-xs shrink-0">
                ২
              </div>
              <div className="text-xs">
                <strong className="text-slate-900 text-sm block mb-0.5">তারা কাজ বা ডিপোজিট করবে</strong>
                <p className="text-slate-500 leading-relaxed">
                  আপনার রেফারেলরা যতবার কোনো কাজ সম্পন্ন করে আর্নিং করবে কিংবা কোনো কাজের জন্য ডিপোজিট করবে, তৎক্ষণাৎ সিস্টেম ৫% হিসেব করবে।
                </p>
              </div>
            </div>

            <div className="flex gap-3.5">
              <div className="w-8 h-8 rounded-full bg-emerald-100 text-emerald-800 font-extrabold flex items-center justify-center text-xs shrink-0">
                ৩
              </div>
              <div className="text-xs">
                <strong className="text-slate-900 text-sm block mb-0.5">১-ক্লিকে ক্যাশআউট করুন</strong>
                <p className="text-slate-500 leading-relaxed">
                  রেফারেল বোনাস "Claim" বাটনে ক্লিক করে সরাসরি মূল ব্যালেন্সে রূপান্তর করে বিকাশ, নগদ বা রকেটে নগদ টাকা তুলে নিন।
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Simulate New Referral Friend (Interactive Demo) */}
        <div className="lg:col-span-5 bg-gradient-to-b from-slate-50 to-white rounded-3xl p-6 border border-slate-200 shadow-xs space-y-4">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-purple-600 text-white flex items-center justify-center">
              <UserPlus className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-slate-900">টেস্ট করুন (Simulate Referral)</h3>
              <p className="text-[11px] text-slate-500">লিংক দিয়ে নতুন বন্ধু যোগ হলে কীভাবে আয় বাড়ে দেখুন</p>
            </div>
          </div>

          <form onSubmit={handleSimulate} className="space-y-3">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                বন্ধুর নাম লিখুন:
              </label>
              <input
                type="text"
                value={testFriendName}
                onChange={(e) => setTestFriendName(e.target.value)}
                placeholder="যেমন: হাসান মাহমুদ বা ফারহানা ইসলাম"
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-xs font-medium focus:ring-2 focus:ring-purple-500 focus:outline-none bg-white"
                required
              />
            </div>

            <button
              type="submit"
              className="w-full py-2.5 rounded-xl bg-purple-600 hover:bg-purple-700 text-white text-xs font-bold transition-all shadow-xs flex items-center justify-center gap-2"
            >
              <UserPlus className="w-4 h-4" />
              <span>নতুন রেফারেল যোগ করে কমিশন পান (+$0.25)</span>
            </button>
          </form>

          <p className="text-[11px] text-slate-400 bg-purple-50 p-2.5 rounded-xl border border-purple-100">
            💡 এটি একটি লাইভ ইন্টারেক্টিভ সিমুলেটর। আপনি নতুন কোনো নাম লিখে বাটনে ক্লিক করলেই নিচে তালিকায় বন্ধুটি যুক্ত হবে এবং আপনার রেফারেল বোনাস বৃদ্ধি পাবে।
          </p>
        </div>

      </div>

      {/* Referred Friends Table */}
      <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-xs space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-base font-bold text-slate-900">
              আমার রেফারেল দল (Referred Team Members)
            </h3>
            <p className="text-xs text-slate-500">
              আপনার লিংক ব্যবহার করে যারা প্ল্যাটফর্মে যোগ দিয়েছেন
            </p>
          </div>
          <span className="text-xs font-bold text-purple-700 bg-purple-50 px-3 py-1 rounded-full border border-purple-100">
            {currentUser.referredUsers.length} জন রেফার্ড
          </span>
        </div>

        {currentUser.referredUsers.length === 0 ? (
          <div className="text-center py-10 text-slate-400 text-xs">
            এখনো কেউ আপনার রেফারেল লিংকে যুক্ত হয়নি। উপরের লিংকটি বন্ধুদের সাথে শেয়ার করুন!
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-slate-600">
              <thead className="bg-slate-50 text-slate-400 uppercase text-[10px] border-y border-slate-100">
                <tr>
                  <th className="py-3 px-3">সদস্যের নাম</th>
                  <th className="py-3 px-3">যোগদানের তারিখ</th>
                  <th className="py-3 px-3">সম্পন্ন কাজ</th>
                  <th className="py-3 px-3">আপনার অর্জিত কমিশন</th>
                  <th className="py-3 px-3">স্ট্যাটাস</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {currentUser.referredUsers.map((member) => (
                  <tr key={member.id} className="hover:bg-slate-50/70 transition-colors">
                    <td className="py-3 px-3 font-bold text-slate-900 flex items-center gap-2">
                      <img 
                        src={member.avatar} 
                        alt={member.name} 
                        className="w-8 h-8 rounded-full object-cover border border-slate-200" 
                      />
                      <span>{member.name}</span>
                    </td>
                    <td className="py-3 px-3 text-slate-400">{member.joinedAt}</td>
                    <td className="py-3 px-3 font-semibold text-slate-700">
                      {member.tasksCompleted} টি টাস্ক
                    </td>
                    <td className="py-3 px-3 font-bold text-emerald-600">
                      +${member.commissionGenerated.toFixed(2)} USD
                      <span className="text-[10px] text-slate-400 font-normal block">
                        (৳{(member.commissionGenerated * config.dollarRateInBDT).toFixed(0)})
                      </span>
                    </td>
                    <td className="py-3 px-3">
                      <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
                        ● অ্যাক্টিভ
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

    </div>
  );
};
