import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { PaymentMethod } from '../../types';
import { 
  DollarSign, 
  ArrowDownLeft, 
  CheckCircle2, 
  Clock, 
  Copy, 
  Check, 
  AlertCircle,
  CreditCard,
  Building,
  ShieldCheck
} from 'lucide-react';

export const EmployerDeposit: React.FC = () => {
  const { currentUser, config, transactions, requestDeposit } = useApp();

  const [depositAmount, setDepositAmount] = useState('20.00');
  const [method, setMethod] = useState<PaymentMethod>('bKash');
  const [senderAccount, setSenderAccount] = useState('');
  const [txId, setTxId] = useState('');
  const [copiedText, setCopiedText] = useState('');
  const [successMsg, setSuccessMsg] = useState('');
  const [errorMsg, setErrorMsg] = useState('');

  const parsedAmount = parseFloat(depositAmount) || 0;
  const bdtAmount = (parsedAmount * config.dollarRateInBDT).toFixed(0);

  // Filter deposit transactions
  const myDeposits = transactions.filter(t => t.userId === currentUser.id && t.type === 'deposit');

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedText(text);
    setTimeout(() => setCopiedText(''), 2000);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');
    setSuccessMsg('');

    if (parsedAmount < 2) {
      setErrorMsg('নূন্যতম ডিপোজিট $২.০০ (৳২৪০)');
      return;
    }

    if (!senderAccount.trim() || !txId.trim()) {
      setErrorMsg('দয়া করে প্রেরক নম্বর/ওয়ালেট এবং ট্রানজেকশন আইডি (TxID) লিখুন!');
      return;
    }

    const res = requestDeposit(parsedAmount, method, senderAccount, txId);
    if (res.success) {
      setSuccessMsg(res.message);
      setTxId('');
    } else {
      setErrorMsg(res.message);
    }
  };

  return (
    <div className="space-y-6">
      
      {/* Balance Card */}
      <div className="bg-gradient-to-r from-blue-900 via-indigo-900 to-slate-900 rounded-3xl p-6 text-white shadow-xl flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <span className="text-xs font-semibold text-blue-200 uppercase tracking-wider block mb-1">
            বর্তমান এমপ্লয়ার ডিপোজিট ব্যালেন্স
          </span>
          <div className="text-3xl font-extrabold tracking-tight">
            ${currentUser.employerBalance.toFixed(2)} USD
          </div>
          <p className="text-xs text-blue-200 mt-1">
            বাংলাদেশি টাকায়: <strong className="text-white">৳{(currentUser.employerBalance * config.dollarRateInBDT).toFixed(0)} BDT</strong>
          </p>
        </div>

        <div className="bg-white/10 backdrop-blur-md px-4 py-3 rounded-2xl border border-white/15 text-xs space-y-1">
          <div className="flex items-center gap-1.5 text-emerald-300 font-semibold">
            <ShieldCheck className="w-4 h-4" />
            <span>১০০% নিরাপদ ট্রানজেকশন</span>
          </div>
          <span className="text-slate-300 block text-[11px]">
            রেট: ১ USD = ৳{config.dollarRateInBDT} BDT • কোনো এক্সট্রা ফি নেই
          </span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Deposit Instructions Card */}
        <div className="lg:col-span-6 bg-white rounded-3xl p-6 border border-slate-200 shadow-xs space-y-4">
          <h3 className="text-sm font-bold text-slate-900 border-b border-slate-100 pb-2.5 flex items-center gap-2">
            <Building className="w-4 h-4 text-blue-600" />
            ১. টাকা পাঠানোর অফিশিয়াল নাম্বারসমূহ
          </h3>

          <p className="text-xs text-slate-600 leading-relaxed">
            নিচের যেকোনো একটি অ্যাকাউন্টে "Send Money" বা পেমেন্ট সম্পন্ন করে ট্রানজেকশন আইডি (TxID) সংরক্ষণ করুন:
          </p>

          <div className="space-y-3">
            {/* bKash */}
            <div className="bg-pink-50/70 border border-pink-200 p-3.5 rounded-2xl flex items-center justify-between">
              <div>
                <span className="text-xs font-bold text-pink-700 block">বিকাশ পার্সোনাল (bKash Send Money)</span>
                <span className="font-mono text-sm font-extrabold text-slate-900">01700-123456</span>
              </div>
              <button
                type="button"
                onClick={() => copyToClipboard('01700-123456')}
                className="px-3 py-1.5 rounded-xl bg-white border border-pink-200 hover:bg-pink-100 text-pink-700 text-xs font-semibold flex items-center gap-1 transition-colors"
              >
                {copiedText === '01700-123456' ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                {copiedText === '01700-123456' ? 'কপি হয়েছে' : 'কপি করুন'}
              </button>
            </div>

            {/* Nagad */}
            <div className="bg-amber-50/70 border border-amber-200 p-3.5 rounded-2xl flex items-center justify-between">
              <div>
                <span className="text-xs font-bold text-amber-700 block">নগদ পার্সোনাল (Nagad Send Money)</span>
                <span className="font-mono text-sm font-extrabold text-slate-900">01800-654321</span>
              </div>
              <button
                type="button"
                onClick={() => copyToClipboard('01800-654321')}
                className="px-3 py-1.5 rounded-xl bg-white border border-amber-200 hover:bg-amber-100 text-amber-700 text-xs font-semibold flex items-center gap-1 transition-colors"
              >
                {copiedText === '01800-654321' ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                {copiedText === '01800-654321' ? 'কপি হয়েছে' : 'কপি করুন'}
              </button>
            </div>

            {/* Binance USDT */}
            <div className="bg-slate-50 border border-slate-300 p-3.5 rounded-2xl flex items-center justify-between">
              <div>
                <span className="text-xs font-bold text-slate-700 block">Binance USDT (TRC-20 Address)</span>
                <span className="font-mono text-xs font-semibold text-slate-900 truncate max-w-[200px] block">
                  TJqK84x...9942aZ
                </span>
              </div>
              <button
                type="button"
                onClick={() => copyToClipboard('TJqK84xR7v77X82991049942aZ')}
                className="px-3 py-1.5 rounded-xl bg-white border border-slate-300 hover:bg-slate-100 text-slate-700 text-xs font-semibold flex items-center gap-1 transition-colors"
              >
                {copiedText === 'TJqK84xR7v77X82991049942aZ' ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                কপি
              </button>
            </div>
          </div>
        </div>

        {/* Deposit Verification Form */}
        <div className="lg:col-span-6 bg-white rounded-3xl p-6 border border-slate-200 shadow-xs space-y-4">
          <h3 className="text-sm font-bold text-slate-900 border-b border-slate-100 pb-2.5 flex items-center gap-2">
            <CreditCard className="w-4 h-4 text-blue-600" />
            ২. ট্রানজেকশন তথ্য সাবমিট করুন (Deposit Request)
          </h3>

          {successMsg && (
            <div className="bg-emerald-50 border border-emerald-200 text-emerald-800 p-3.5 rounded-2xl text-xs flex items-center gap-2">
              <CheckCircle2 className="w-5 h-5 shrink-0 text-emerald-600" />
              <span>{successMsg}</span>
            </div>
          )}

          {errorMsg && (
            <div className="bg-rose-50 border border-rose-200 text-rose-800 p-3.5 rounded-2xl text-xs flex items-center gap-2">
              <AlertCircle className="w-5 h-5 shrink-0 text-rose-600" />
              <span>{errorMsg}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-3.5">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                কোন মাধ্যমে টাকা পাঠিয়েছেন:
              </label>
              <select
                value={method}
                onChange={(e) => setMethod(e.target.value as PaymentMethod)}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-xs font-semibold bg-white focus:ring-2 focus:ring-blue-500"
              >
                <option value="bKash">বিকাশ (bKash)</option>
                <option value="Nagad">নগদ (Nagad)</option>
                <option value="Rocket">রকেট (Rocket)</option>
                <option value="Binance USDT">Binance USDT (TRC-20)</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                কত ডলার লোড করতে চান (USD):
              </label>
              <div className="relative">
                <span className="absolute left-3.5 top-1/2 -translate-y-1/2 font-bold text-slate-400">$</span>
                <input
                  type="number"
                  step="1"
                  min="2"
                  value={depositAmount}
                  onChange={(e) => setDepositAmount(e.target.value)}
                  className="w-full pl-8 pr-28 py-2.5 rounded-xl border border-slate-300 text-sm font-bold focus:ring-2 focus:ring-blue-500"
                  required
                />
                <div className="absolute right-3.5 top-1/2 -translate-y-1/2 text-xs font-bold text-blue-700">
                  = ৳{bdtAmount} BDT
                </div>
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                যে নাম্বার/ওয়ালেট থেকে টাকা পাঠিয়েছেন (Sender Info):
              </label>
              <input
                type="text"
                value={senderAccount}
                onChange={(e) => setSenderAccount(e.target.value)}
                placeholder="যেমন: 017XXXXXXXX"
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-xs sm:text-sm font-medium focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                ট্রানজেকশন আইডি (Transaction ID / TrxID):
              </label>
              <input
                type="text"
                value={txId}
                onChange={(e) => setTxId(e.target.value)}
                placeholder="যেমন: BKASH98274102 বা 9A47X..."
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-xs sm:text-sm font-mono focus:ring-2 focus:ring-blue-500 uppercase"
                required
              />
            </div>

            <button
              type="submit"
              className="w-full py-3 rounded-2xl bg-blue-600 hover:bg-blue-700 text-white text-xs sm:text-sm font-bold shadow-md shadow-blue-200 transition-all flex items-center justify-center gap-2"
            >
              <ArrowDownLeft className="w-4 h-4" />
              <span>ডিপোজিট রিকোয়েস্ট জমা দিন (৳{bdtAmount})</span>
            </button>
          </form>
        </div>

      </div>

      {/* Deposit History */}
      <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-xs">
        <h3 className="text-sm font-bold text-slate-900 mb-4">
          আমার ডিপোজিট হিস্ট্রি (Deposit History)
        </h3>

        {myDeposits.length === 0 ? (
          <div className="text-center py-8 text-slate-400 text-xs">
            এখনো কোনো ডিপোজিট করা হয়নি।
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 text-slate-500 uppercase text-[10px] border-y border-slate-100">
                <tr>
                  <th className="py-2.5 px-3">তারিখ</th>
                  <th className="py-2.5 px-3">মেথড</th>
                  <th className="py-2.5 px-3">TrxID</th>
                  <th className="py-2.5 px-3">পরিমাণ (USD)</th>
                  <th className="py-2.5 px-3">টাকা (BDT)</th>
                  <th className="py-2.5 px-3">স্ট্যাটাস</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-slate-700">
                {myDeposits.map(tx => (
                  <tr key={tx.id} className="hover:bg-slate-50/60">
                    <td className="py-3 px-3 text-slate-400 whitespace-nowrap">{tx.date}</td>
                    <td className="py-3 px-3 font-semibold">{tx.method}</td>
                    <td className="py-3 px-3 font-mono text-slate-800">{tx.txId || '-'}</td>
                    <td className="py-3 px-3 font-bold text-slate-900">${tx.amount.toFixed(2)}</td>
                    <td className="py-3 px-3 font-bold text-blue-700">৳{(tx.amount * config.dollarRateInBDT).toFixed(0)}</td>
                    <td className="py-3 px-3">
                      {tx.status === 'completed' && (
                        <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800">
                          ✓ অ্যাপ্রুভড (Approved)
                        </span>
                      )}
                      {tx.status === 'pending' && (
                        <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-100 text-amber-800">
                          ⏳ ভেরিফিকেশন পেন্ডিং (Pending)
                        </span>
                      )}
                      {tx.status === 'rejected' && (
                        <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-rose-100 text-rose-800">
                          ✕ বাতিল (Rejected)
                        </span>
                      )}
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
