import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { PaymentMethod } from '../../types';
import { 
  Wallet, 
  ArrowUpRight, 
  ArrowDownLeft, 
  Clock, 
  ShieldCheck, 
  DollarSign,
  Copy,
  Check,
  Building,
  Smartphone,
  CheckCircle2,
  AlertCircle
} from 'lucide-react';

interface UnifiedWalletProps {
  initialTab?: 'withdraw' | 'deposit' | 'history';
}

export const UnifiedWallet: React.FC<UnifiedWalletProps> = ({ initialTab = 'withdraw' }) => {
  const { currentUser, config, transactions, requestWithdrawal, requestDeposit } = useApp();

  const [activeSubTab, setActiveSubTab] = useState<'withdraw' | 'deposit' | 'history'>(initialTab);

  React.useEffect(() => {
    if (initialTab) {
      setActiveSubTab(initialTab);
    }
  }, [initialTab]);

  // Withdrawal state
  const [withdrawAmount, setWithdrawAmount] = useState<string>('2.00');
  const [withdrawMethod, setWithdrawMethod] = useState<PaymentMethod>('bKash');
  const [withdrawAccount, setWithdrawAccount] = useState<string>(currentUser.phone || '01712-345678');
  const [withdrawSuccess, setWithdrawSuccess] = useState('');
  const [withdrawError, setWithdrawError] = useState('');

  // Deposit state
  const [depositAmount, setDepositAmount] = useState<string>('10.00');
  const [depositMethod, setDepositMethod] = useState<PaymentMethod>('bKash');
  const [depositSenderAccount, setDepositSenderAccount] = useState('');
  const [depositTxId, setDepositTxId] = useState('');
  const [depositSuccess, setDepositSuccess] = useState('');
  const [depositError, setDepositError] = useState('');
  const [copiedText, setCopiedText] = useState('');

  const parsedWithdraw = parseFloat(withdrawAmount) || 0;
  const withdrawFeePercent = config.withdrawalFeePercent || 5;
  const withdrawFeeUSD = Number(((parsedWithdraw * withdrawFeePercent) / 100).toFixed(2));
  const netWithdrawUSD = Math.max(0, Number((parsedWithdraw - withdrawFeeUSD).toFixed(2)));

  const withdrawBdt = (parsedWithdraw * config.dollarRateInBDT).toFixed(0);
  const withdrawFeeBdt = (withdrawFeeUSD * config.dollarRateInBDT).toFixed(0);
  const netWithdrawBdt = (netWithdrawUSD * config.dollarRateInBDT).toFixed(0);

  const parsedDeposit = parseFloat(depositAmount) || 0;
  const depositBdt = (parsedDeposit * config.dollarRateInBDT).toFixed(0);

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedText(text);
    setTimeout(() => setCopiedText(''), 2000);
  };

  const handleWithdrawSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setWithdrawError('');
    setWithdrawSuccess('');

    if (parsedWithdraw < config.minWithdrawalUSD) {
      setWithdrawError(`নূন্যতম উইথড্রয়াল পরিমাণ $${config.minWithdrawalUSD.toFixed(2)} (৳${(config.minWithdrawalUSD * config.dollarRateInBDT).toFixed(0)})!`);
      return;
    }

    if (parsedWithdraw > currentUser.workerBalance) {
      setWithdrawError(`আপনার আর্নিং অ্যাকাউন্টে পর্যাপ্ত ব্যালেন্স নেই! বর্তমান ব্যালেন্স: $${currentUser.workerBalance.toFixed(2)}`);
      return;
    }

    if (!withdrawAccount.trim()) {
      setWithdrawError('দয়া করে আপনার বিকাশ/নগদ নাম্বার বা ওয়ালেট এড্রেস লিখুন!');
      return;
    }

    const res = requestWithdrawal(parsedWithdraw, withdrawMethod, withdrawAccount);
    if (res.success) {
      setWithdrawSuccess(res.message);
      setWithdrawAmount(config.minWithdrawalUSD.toString());
    } else {
      setWithdrawError(res.message);
    }
  };

  const handleDepositSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setDepositError('');
    setDepositSuccess('');

    if (parsedDeposit < 2) {
      setDepositError('নূন্যতম ডিপোজিট $২.০০ (৳২৪০)');
      return;
    }

    if (!depositSenderAccount.trim() || !depositTxId.trim()) {
      setDepositError('দয়া করে প্রেরক নম্বর/ওয়ালেট এবং ট্রানজেকশন আইডি (TxID) লিখুন!');
      return;
    }

    const res = requestDeposit(parsedDeposit, depositMethod, depositSenderAccount, depositTxId);
    if (res.success) {
      setDepositSuccess(res.message);
      setDepositTxId('');
    } else {
      setDepositError(res.message);
    }
  };

  const userTransactions = transactions.filter(t => t.userId === currentUser.id);

  return (
    <div className="space-y-6">
      
      {/* Wallet Balance Hero Banner */}
      <div className="bg-linear-to-r from-slate-900 via-slate-800 to-emerald-950 text-white p-6 sm:p-8 rounded-3xl border border-slate-700 shadow-xl relative overflow-hidden">
        <div className="absolute top-0 right-0 -mr-16 -mt-16 w-64 h-64 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />
        
        <div className="relative z-10">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 text-emerald-300 text-xs font-semibold mb-2 border border-white/10">
                <Wallet className="w-3.5 h-3.5" />
                <span>সেন্ট্রাল ওয়ালেট ও লেনদেন হাব</span>
              </div>
              <h1 className="text-xl sm:text-2xl font-bold">মাইক্রো জব ওয়ালেট (Wallet Overview)</h1>
              <p className="text-xs sm:text-sm text-slate-300 mt-1 max-w-xl">
                কাজ সম্পন্ন করে অর্জিত টাকা উইথড্র করুন, অথবা নতুন কাজ পোস্ট করার জন্য সহজে বিকাশ, নগদ বা রকেটে ডিপোজিট করুন।
              </p>
            </div>

            {/* Quick Currency Rate Badge */}
            <div className="bg-white/10 backdrop-blur-md px-4 py-2.5 rounded-2xl border border-white/10 text-right shrink-0">
              <span className="text-[11px] text-slate-300 block">বর্তমান ডলার রেট</span>
              <span className="text-base font-extrabold text-emerald-400">১ USD = ৳{config.dollarRateInBDT} BDT</span>
            </div>
          </div>

          {/* Balance Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-6">
            {/* Worker Earnings */}
            <div className="bg-white/10 backdrop-blur-md p-4 sm:p-5 rounded-2xl border border-white/15">
              <div className="flex items-center justify-between text-slate-300 text-xs font-semibold mb-1">
                <span>আর্নিং ব্যালেন্স (কাজের আয়)</span>
                <span className="text-emerald-400 font-bold text-[11px]">উইথড্রযোগ্য</span>
              </div>
              <div className="text-2xl sm:text-3xl font-extrabold text-white">
                ${currentUser.workerBalance.toFixed(2)}
              </div>
              <div className="text-xs text-emerald-300 font-medium mt-1">
                ≈ ৳{(currentUser.workerBalance * config.dollarRateInBDT).toFixed(0)} BDT
              </div>
              <div className="text-[11px] text-slate-400 mt-2 pt-2 border-t border-white/10 flex items-center justify-between">
                <span>পেন্ডিং রিভিউ:</span>
                <span className="text-amber-300 font-semibold">${currentUser.pendingBalance.toFixed(2)}</span>
              </div>
            </div>

            {/* Employer Deposit */}
            <div className="bg-white/10 backdrop-blur-md p-4 sm:p-5 rounded-2xl border border-white/15">
              <div className="flex items-center justify-between text-slate-300 text-xs font-semibold mb-1">
                <span>জব পোস্টিং ব্যালেন্স</span>
                <span className="text-blue-300 font-bold text-[11px]">জব তৈরি করতে</span>
              </div>
              <div className="text-2xl sm:text-3xl font-extrabold text-white">
                ${currentUser.employerBalance.toFixed(2)}
              </div>
              <div className="text-xs text-blue-300 font-medium mt-1">
                ≈ ৳{(currentUser.employerBalance * config.dollarRateInBDT).toFixed(0)} BDT
              </div>
              <div className="text-[11px] text-slate-400 mt-2 pt-2 border-t border-white/10">
                কাজের এসক্রো ফান্ড হিসেবে ব্যবহৃত হয়
              </div>
            </div>

            {/* Referral Earnings */}
            <div className="bg-white/10 backdrop-blur-md p-4 sm:p-5 rounded-2xl border border-white/15">
              <div className="flex items-center justify-between text-slate-300 text-xs font-semibold mb-1">
                <span>রেফারেল আয়</span>
                <span className="text-purple-300 font-bold text-[11px]">বোনাস</span>
              </div>
              <div className="text-2xl sm:text-3xl font-extrabold text-white">
                ${currentUser.referralEarnings.toFixed(2)}
              </div>
              <div className="text-xs text-purple-300 font-medium mt-1">
                ≈ ৳{(currentUser.referralEarnings * config.dollarRateInBDT).toFixed(0)} BDT
              </div>
              <div className="text-[11px] text-slate-400 mt-2 pt-2 border-t border-white/10">
                বন্ধুরা কাজ করলে {config.referralCommissionPercent}% কমিশন জমা হয়
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-2 border-b border-slate-200 pb-3">
        <button
          onClick={() => setActiveSubTab('withdraw')}
          className={`flex items-center gap-2 px-5 py-2.5 rounded-2xl text-xs sm:text-sm font-bold transition-all ${
            activeSubTab === 'withdraw'
              ? 'bg-emerald-600 text-white shadow-sm'
              : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
          }`}
        >
          <ArrowUpRight className="w-4 h-4" />
          <span>টাকা তুলুন (Withdraw Earnings)</span>
        </button>

        <button
          onClick={() => setActiveSubTab('deposit')}
          className={`flex items-center gap-2 px-5 py-2.5 rounded-2xl text-xs sm:text-sm font-bold transition-all ${
            activeSubTab === 'deposit'
              ? 'bg-blue-600 text-white shadow-sm'
              : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
          }`}
        >
          <ArrowDownLeft className="w-4 h-4" />
          <span>এড মানি / ডিপোজিট (Add Money)</span>
        </button>

        <button
          onClick={() => setActiveSubTab('history')}
          className={`flex items-center gap-2 px-5 py-2.5 rounded-2xl text-xs sm:text-sm font-bold transition-all ${
            activeSubTab === 'history'
              ? 'bg-slate-900 text-white shadow-sm'
              : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
          }`}
        >
          <Clock className="w-4 h-4" />
          <span>লেনদেন বিবরণী (Transaction History)</span>
        </button>
      </div>

      {/* Tab 1: Withdraw */}
      {activeSubTab === 'withdraw' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          <div className="lg:col-span-7 bg-white rounded-3xl p-6 border border-slate-200 shadow-xs">
            <div className="flex items-center gap-2 mb-4 pb-3 border-b border-slate-100">
              <ArrowUpRight className="w-5 h-5 text-emerald-600" />
              <div>
                <h3 className="text-base font-bold text-slate-900">টাকা তোলার আবেদন (Cashout)</h3>
                <p className="text-xs text-slate-500">
                  নূন্যতম উইথড্রয়াল: ${config.minWithdrawalUSD.toFixed(2)} (৳{(config.minWithdrawalUSD * config.dollarRateInBDT).toFixed(0)}) | ওয়েবসাইট ফি: {withdrawFeePercent}%
                </p>
              </div>
            </div>

            {withdrawSuccess && (
              <div className="mb-4 bg-emerald-50 border border-emerald-200 text-emerald-800 p-3.5 rounded-2xl flex items-center gap-2 text-xs font-semibold">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>{withdrawSuccess}</span>
              </div>
            )}

            {withdrawError && (
              <div className="mb-4 bg-rose-50 border border-rose-200 text-rose-800 p-3.5 rounded-2xl flex items-center gap-2 text-xs font-semibold">
                <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
                <span>{withdrawError}</span>
              </div>
            )}

            <form onSubmit={handleWithdrawSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  পেমেন্ট গ্রহণ মাধ্যম নির্বাচন করুন:
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                  {(['bKash', 'Nagad', 'Rocket', 'Binance USDT'] as PaymentMethod[]).map(pm => (
                    <button
                      key={pm}
                      type="button"
                      onClick={() => setWithdrawMethod(pm)}
                      className={`p-3 rounded-2xl border text-center text-xs font-bold transition-all ${
                        withdrawMethod === pm
                          ? 'border-emerald-500 bg-emerald-50/80 text-emerald-900 ring-2 ring-emerald-500/20'
                          : 'border-slate-200 bg-white hover:bg-slate-50 text-slate-700'
                      }`}
                    >
                      {pm}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  টাকার পরিমাণ (USD):
                </label>
                <div className="relative">
                  <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 font-bold">$</span>
                  <input
                    type="number"
                    step="0.01"
                    min={config.minWithdrawalUSD}
                    value={withdrawAmount}
                    onChange={(e) => setWithdrawAmount(e.target.value)}
                    className="w-full pl-8 pr-32 py-2.5 rounded-xl border border-slate-300 text-sm font-bold focus:ring-2 focus:ring-emerald-500"
                    required
                  />
                  <div className="absolute right-3.5 top-1/2 -translate-y-1/2 text-xs font-semibold text-emerald-700 bg-emerald-50 px-2 py-1 rounded-lg">
                    ≈ ৳{withdrawBdt} BDT
                  </div>
                </div>
              </div>

              {/* Website Fee & Net Payable Calculation Box */}
              <div className="bg-slate-50 rounded-2xl p-3.5 border border-slate-200 space-y-2 text-xs">
                <div className="flex justify-between text-slate-600">
                  <span>উত্তোলনের মোট পরিমাণ:</span>
                  <span className="font-bold text-slate-900">${parsedWithdraw.toFixed(2)} USD (৳{withdrawBdt} BDT)</span>
                </div>
                <div className="flex justify-between text-amber-700 font-medium">
                  <span>ওয়েবসাইট সার্ভিস ফি ({withdrawFeePercent}%):</span>
                  <span className="font-bold">-${withdrawFeeUSD.toFixed(2)} USD (-৳{withdrawFeeBdt} BDT)</span>
                </div>
                <div className="pt-2 border-t border-slate-200 flex justify-between items-center text-emerald-800">
                  <span className="font-bold">আপনি নেট পাবেন (বিকাশ/নগদে পাঠানো হবে):</span>
                  <span className="text-sm font-black text-emerald-600">${netWithdrawUSD.toFixed(2)} USD (৳{netWithdrawBdt} BDT)</span>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  {withdrawMethod === 'Binance USDT' ? 'Binance USDT (TRC20/BEP20) ওয়ালেট / Pay ID:' : `${withdrawMethod} ব্যক্তিগত নম্বর:`}
                </label>
                <input
                  type="text"
                  placeholder={withdrawMethod === 'Binance USDT' ? 'Binance Pay ID / USDT Address' : '017XXXXXXXX'}
                  value={withdrawAccount}
                  onChange={(e) => setWithdrawAccount(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm font-mono focus:ring-2 focus:ring-emerald-500"
                  required
                />
              </div>

              <button
                type="submit"
                className="w-full py-3 rounded-2xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-sm shadow-md shadow-emerald-200 transition-all cursor-pointer"
              >
                উইথড্রয়াল রিকোয়েস্ট পাঠান
              </button>
            </form>
          </div>

          <div className="lg:col-span-5 bg-white rounded-3xl p-6 border border-slate-200 shadow-xs space-y-4">
            <h3 className="text-sm font-bold text-slate-900 border-b border-slate-100 pb-2.5 flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-emerald-600" />
              উইথড্রয়াল নিয়ম ও সময়সীমা
            </h3>
            <ul className="space-y-2.5 text-xs text-slate-600 leading-relaxed">
              <li className="flex items-start gap-2">
                <span className="text-emerald-600 font-bold">•</span>
                <span>নূন্যতম উইথড্র সীমা <strong>${config.minWithdrawalUSD.toFixed(2)}</strong> (৳{(config.minWithdrawalUSD * config.dollarRateInBDT).toFixed(0)})।</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-amber-600 font-bold">•</span>
                <span>ওয়েবসাইট সার্ভিস ফি: পেমেন্ট নেওয়ার সময় মাত্র <strong>{withdrawFeePercent}%</strong> ওয়েবসাইট সার্ভিস ফি কর্তন করা হয় এবং নেট টাকা আপনার নম্বরে পাঠানো হয়।</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-emerald-600 font-bold">•</span>
                <span>রিকোয়েস্ট করার সাধারণত ১ থেকে ১২ ঘণ্টার মধ্যে টাকা পাঠিয়ে দেওয়া হয়।</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-emerald-600 font-bold">•</span>
                <span>সফল উইথড্রয়ালের নোটিফিকেশন আপনার অ্যাকাউন্টে সরাসরি দেখতে পাবেন।</span>
              </li>
            </ul>
          </div>
        </div>
      )}

      {/* Tab 2: Deposit */}
      {activeSubTab === 'deposit' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          <div className="lg:col-span-6 bg-white rounded-3xl p-6 border border-slate-200 shadow-xs space-y-4">
            <h3 className="text-sm font-bold text-slate-900 border-b border-slate-100 pb-2.5 flex items-center gap-2">
              <Building className="w-4 h-4 text-blue-600" />
              টাকা পাঠানোর অফিশিয়াল নাম্বারসমূহ
            </h3>

            <div className="space-y-3">
              <div className="bg-pink-50/70 border border-pink-200 p-3.5 rounded-2xl flex items-center justify-between">
                <div>
                  <span className="text-xs font-bold text-pink-700 block">বিকাশ পার্সোনাল (Send Money)</span>
                  <span className="font-mono text-sm font-extrabold text-slate-900">01700-123456</span>
                </div>
                <button
                  type="button"
                  onClick={() => copyToClipboard('01700-123456')}
                  className="px-3 py-1.5 rounded-xl bg-pink-600 hover:bg-pink-700 text-white text-xs font-bold flex items-center gap-1"
                >
                  {copiedText === '01700-123456' ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>কপি</span>
                </button>
              </div>

              <div className="bg-orange-50/70 border border-orange-200 p-3.5 rounded-2xl flex items-center justify-between">
                <div>
                  <span className="text-xs font-bold text-orange-700 block">নগদ পার্সোনাল (Send Money)</span>
                  <span className="font-mono text-sm font-extrabold text-slate-900">01800-654321</span>
                </div>
                <button
                  type="button"
                  onClick={() => copyToClipboard('01800-654321')}
                  className="px-3 py-1.5 rounded-xl bg-orange-600 hover:bg-orange-700 text-white text-xs font-bold flex items-center gap-1"
                >
                  {copiedText === '01800-654321' ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>কপি</span>
                </button>
              </div>

              <div className="bg-purple-50/70 border border-purple-200 p-3.5 rounded-2xl flex items-center justify-between">
                <div>
                  <span className="text-xs font-bold text-purple-700 block">রকেট পার্সোনাল (Send Money)</span>
                  <span className="font-mono text-sm font-extrabold text-slate-900">01900-7890124</span>
                </div>
                <button
                  type="button"
                  onClick={() => copyToClipboard('01900-7890124')}
                  className="px-3 py-1.5 rounded-xl bg-purple-600 hover:bg-purple-700 text-white text-xs font-bold flex items-center gap-1"
                >
                  {copiedText === '01900-7890124' ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>কপি</span>
                </button>
              </div>
            </div>
          </div>

          <div className="lg:col-span-6 bg-white rounded-3xl p-6 border border-slate-200 shadow-xs">
            <h3 className="text-sm font-bold text-slate-900 border-b border-slate-100 pb-2.5 mb-4">
              ডিপোজিট বিবরণী জমা দিন
            </h3>

            {depositSuccess && (
              <div className="mb-4 bg-emerald-50 border border-emerald-200 text-emerald-800 p-3.5 rounded-2xl flex items-center gap-2 text-xs font-semibold">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>{depositSuccess}</span>
              </div>
            )}

            {depositError && (
              <div className="mb-4 bg-rose-50 border border-rose-200 text-rose-800 p-3.5 rounded-2xl flex items-center gap-2 text-xs font-semibold">
                <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
                <span>{depositError}</span>
              </div>
            )}

            <form onSubmit={handleDepositSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  পেমেন্ট মেথড:
                </label>
                <div className="grid grid-cols-3 gap-2">
                  {(['bKash', 'Nagad', 'Rocket'] as PaymentMethod[]).map(pm => (
                    <button
                      key={pm}
                      type="button"
                      onClick={() => setDepositMethod(pm)}
                      className={`p-2.5 rounded-xl border text-xs font-bold transition-all ${
                        depositMethod === pm
                          ? 'border-blue-500 bg-blue-50 text-blue-900 ring-2 ring-blue-500/20'
                          : 'border-slate-200 bg-white hover:bg-slate-50 text-slate-700'
                      }`}
                    >
                      {pm}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  ডিপোজিট পরিমাণ (USD):
                </label>
                <div className="relative">
                  <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 font-bold">$</span>
                  <input
                    type="number"
                    step="0.01"
                    min="2"
                    value={depositAmount}
                    onChange={(e) => setDepositAmount(e.target.value)}
                    className="w-full pl-8 pr-32 py-2.5 rounded-xl border border-slate-300 text-sm font-bold focus:ring-2 focus:ring-blue-500"
                    required
                  />
                  <div className="absolute right-3.5 top-1/2 -translate-y-1/2 text-xs font-semibold text-blue-700 bg-blue-50 px-2 py-1 rounded-lg">
                    ≈ ৳{depositBdt} BDT
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  প্রেরক মোবাইল নম্বর:
                </label>
                <input
                  type="text"
                  placeholder="যে নম্বর থেকে টাকা পাঠিয়েছেন"
                  value={depositSenderAccount}
                  onChange={(e) => setDepositSenderAccount(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm font-mono focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  ট্রানজেকশন আইডি (TxID):
                </label>
                <input
                  type="text"
                  placeholder="উদা: 9A8B7C6D5E"
                  value={depositTxId}
                  onChange={(e) => setDepositTxId(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm font-mono uppercase focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>

              <button
                type="submit"
                className="w-full py-3 rounded-2xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-sm shadow-md shadow-blue-200 transition-all cursor-pointer"
              >
                ডিপোজিট রিকোয়েস্ট জমা দিন
              </button>
            </form>
          </div>
        </div>
      )}

      {/* Tab 3: History */}
      {activeSubTab === 'history' && (
        <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-xs">
          <h3 className="text-sm font-bold text-slate-900 mb-4">
            সকল লেনদেন বিবরণী (All Transactions)
          </h3>

          {userTransactions.length === 0 ? (
            <div className="text-center py-8 text-slate-400 text-xs">
              এখনো কোনো লেনদেনের রেকর্ড পাওয়া যায়নি।
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-50 text-slate-500 uppercase text-[10px] border-y border-slate-100">
                  <tr>
                    <th className="py-2.5 px-3">তারিখ</th>
                    <th className="py-2.5 px-3">ধরণ</th>
                    <th className="py-2.5 px-3">মেথড / বিবরণ</th>
                    <th className="py-2.5 px-3">পরিমাণ (USD)</th>
                    <th className="py-2.5 px-3">টাকা (BDT)</th>
                    <th className="py-2.5 px-3">স্ট্যাটাস</th>
                    <th className="py-2.5 px-3">নোট / TrxID</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 text-slate-700">
                  {userTransactions.map(tx => (
                    <tr key={tx.id} className="hover:bg-slate-50/60">
                      <td className="py-3 px-3 text-slate-400 whitespace-nowrap">{tx.date}</td>
                      <td className="py-3 px-3">
                        <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                          tx.type === 'deposit'
                            ? 'bg-blue-100 text-blue-800'
                            : tx.type === 'withdrawal'
                            ? 'bg-purple-100 text-purple-800'
                            : 'bg-emerald-100 text-emerald-800'
                        }`}>
                          {tx.type === 'deposit' ? 'ডিপোজিট' : tx.type === 'withdrawal' ? 'উইথড্রয়াল' : tx.type}
                        </span>
                      </td>
                      <td className="py-3 px-3 font-semibold">
                        <span>{tx.method}</span>
                        {tx.accountDetails && (
                          <span className="block text-[11px] text-slate-400 font-mono">{tx.accountDetails}</span>
                        )}
                      </td>
                      <td className="py-3 px-3 font-bold text-slate-900">${tx.amount.toFixed(2)}</td>
                      <td className="py-3 px-3 font-bold text-emerald-700">৳{(tx.amount * config.dollarRateInBDT).toFixed(0)}</td>
                      <td className="py-3 px-3">
                        {tx.status === 'completed' && (
                          <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800">
                            ✓ পরিশোধিত / সফল
                          </span>
                        )}
                        {tx.status === 'pending' && (
                          <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-100 text-amber-800">
                            ⏳ পেন্ডিং
                          </span>
                        )}
                        {tx.status === 'rejected' && (
                          <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-rose-100 text-rose-800">
                            ✕ বাতিল
                          </span>
                        )}
                      </td>
                      <td className="py-3 px-3 text-slate-500 font-mono text-[11px]">
                        {tx.txId || tx.note || '-'}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}

    </div>
  );
};
