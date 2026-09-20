import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { PaymentMethod } from '../../types';
import { 
  Wallet, 
  ArrowUpRight, 
  CheckCircle2, 
  Clock, 
  AlertCircle, 
  Smartphone, 
  ShieldCheck, 
  DollarSign,
  HelpCircle
} from 'lucide-react';

export const WorkerWallet: React.FC = () => {
  const { currentUser, transactions, config, requestWithdrawal } = useApp();

  const [withdrawAmount, setWithdrawAmount] = useState<string>('2.00');
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>('bKash');
  const [accountNumber, setAccountNumber] = useState<string>(currentUser.phone || '01712-345678');
  const [successMessage, setSuccessMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  // User's transactions
  const myTransactions = transactions.filter(t => t.userId === currentUser.id && t.type === 'withdrawal');

  const parsedAmount = parseFloat(withdrawAmount) || 0;
  const withdrawFeePercent = config.withdrawalFeePercent || 5;
  const withdrawFeeUSD = Number(((parsedAmount * withdrawFeePercent) / 100).toFixed(2));
  const netWithdrawUSD = Math.max(0, Number((parsedAmount - withdrawFeeUSD).toFixed(2)));
  const bdtCalculated = (parsedAmount * config.dollarRateInBDT).toFixed(0);
  const netBdtCalculated = (netWithdrawUSD * config.dollarRateInBDT).toFixed(0);
  const feeBdtCalculated = (withdrawFeeUSD * config.dollarRateInBDT).toFixed(0);

  const handleWithdrawSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');
    setSuccessMessage('');

    if (parsedAmount < config.minWithdrawalUSD) {
      setErrorMessage(`নূন্যতম উইথড্রয়াল পরিমাণ $${config.minWithdrawalUSD.toFixed(2)} (৳${(config.minWithdrawalUSD * config.dollarRateInBDT).toFixed(0)})!`);
      return;
    }

    if (parsedAmount > currentUser.workerBalance) {
      setErrorMessage(`আপনার অ্যাকাউন্টে পর্যাপ্ত ব্যালেন্স নেই! বর্তমান ব্যালেন্স: $${currentUser.workerBalance.toFixed(2)}`);
      return;
    }

    if (!accountNumber.trim()) {
      setErrorMessage('দয়া করে আপনার বিকাশ/নগদ নাম্বার বা ওয়ালেট এড্রেস লিখুন!');
      return;
    }

    const res = requestWithdrawal(parsedAmount, paymentMethod, accountNumber);
    if (res.success) {
      setSuccessMessage(res.message);
      setWithdrawAmount(config.minWithdrawalUSD.toString());
    } else {
      setErrorMessage(res.message);
    }
  };

  return (
    <div className="space-y-6">
      
      {/* Wallet Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        
        {/* Available Balance */}
        <div className="bg-gradient-to-br from-emerald-600 to-teal-800 rounded-3xl p-6 text-white shadow-lg">
          <div className="flex items-center justify-between text-emerald-100 mb-3">
            <span className="text-xs font-semibold uppercase tracking-wider">উইথড্রযোগ্য ব্যালেন্স</span>
            <Wallet className="w-5 h-5 text-emerald-300" />
          </div>
          <div className="text-3xl font-extrabold tracking-tight">
            ${currentUser.workerBalance.toFixed(2)}
          </div>
          <div className="mt-2 text-xs text-emerald-100 flex items-center gap-1">
            <span>বাংলাদেশি টাকায়:</span>
            <strong className="text-white text-sm">৳{(currentUser.workerBalance * config.dollarRateInBDT).toFixed(0)} BDT</strong>
          </div>
          <div className="mt-3 pt-3 border-t border-emerald-500/40 text-[11px] text-emerald-200">
            ✓ বিকাশ, নগদ বা রকেটে যেকোনো সময় তুলতে পারবেন
          </div>
        </div>

        {/* Pending Balance */}
        <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-xs">
          <div className="flex items-center justify-between text-slate-400 mb-3">
            <span className="text-xs font-bold uppercase tracking-wider">পেন্ডিং রিভিউ আর্নিং</span>
            <Clock className="w-5 h-5 text-amber-500" />
          </div>
          <div className="text-3xl font-extrabold text-slate-900 tracking-tight">
            ${currentUser.pendingBalance.toFixed(2)}
          </div>
          <div className="mt-2 text-xs text-slate-500">
            সমপরিমাণ: <strong className="text-slate-800">৳{(currentUser.pendingBalance * config.dollarRateInBDT).toFixed(0)} BDT</strong>
          </div>
          <div className="mt-3 pt-3 border-t border-slate-100 text-[11px] text-amber-700 font-medium">
            ⏳ এমপ্লয়ার রিভিউ করলেই এই টাকা মূল ব্যালেন্সে যোগ হবে
          </div>
        </div>

        {/* Completed Stats */}
        <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-xs">
          <div className="flex items-center justify-between text-slate-400 mb-3">
            <span className="text-xs font-bold uppercase tracking-wider">সাকসেস রেট ও টাস্ক</span>
            <ShieldCheck className="w-5 h-5 text-emerald-600" />
          </div>
          <div className="text-3xl font-extrabold text-emerald-600 tracking-tight">
            {currentUser.successRate}%
          </div>
          <div className="mt-2 text-xs text-slate-500">
            মোট কাজ সম্পন্ন করেছেন: <strong className="text-slate-800">{currentUser.completedTasksCount}টি</strong>
          </div>
          <div className="mt-3 pt-3 border-t border-slate-100 text-[11px] text-slate-400">
            রেটিং ৭৫%+ থাকলে আনলিমিটেড কাজ করা যায়
          </div>
        </div>

      </div>

      {/* Withdrawal Form & Methods */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Left: Request Cashout */}
        <div className="lg:col-span-7 bg-white rounded-3xl p-6 border border-slate-200 shadow-xs">
          <div className="flex items-center gap-2 mb-4 pb-3 border-b border-slate-100">
            <ArrowUpRight className="w-5 h-5 text-emerald-600" />
            <div>
              <h3 className="text-base font-bold text-slate-900">টাকা তুলুন (Withdraw Funds)</h3>
              <p className="text-xs text-slate-500">
                নূন্যতম উইথড্রয়াল: ${config.minWithdrawalUSD.toFixed(2)} (৳{(config.minWithdrawalUSD * config.dollarRateInBDT).toFixed(0)}) • রেট: ৳{config.dollarRateInBDT}/USD
              </p>
            </div>
          </div>

          {successMessage && (
            <div className="mb-4 bg-emerald-50 border border-emerald-200 text-emerald-800 p-3.5 rounded-2xl text-xs flex items-center gap-2">
              <CheckCircle2 className="w-5 h-5 shrink-0 text-emerald-600" />
              <span>{successMessage}</span>
            </div>
          )}

          {errorMessage && (
            <div className="mb-4 bg-rose-50 border border-rose-200 text-rose-800 p-3.5 rounded-2xl text-xs flex items-center gap-2">
              <AlertCircle className="w-5 h-5 shrink-0 text-rose-600" />
              <span>{errorMessage}</span>
            </div>
          )}

          <form onSubmit={handleWithdrawSubmit} className="space-y-4">
            
            {/* Payment Method Selector */}
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-2">
                পেমেন্ট মেথড বেছে নিন:
              </label>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                {(['bKash', 'Nagad', 'Rocket', 'Binance USDT'] as PaymentMethod[]).map(method => (
                  <button
                    key={method}
                    type="button"
                    onClick={() => setPaymentMethod(method)}
                    className={`py-2.5 px-3 rounded-xl border text-xs font-bold transition-all text-center ${
                      paymentMethod === method
                        ? 'border-emerald-600 bg-emerald-50 text-emerald-800 ring-2 ring-emerald-500/20 shadow-xs'
                        : 'border-slate-200 bg-white text-slate-600 hover:border-slate-300'
                    }`}
                  >
                    {method === 'bKash' && 'বিকাশ (bKash)'}
                    {method === 'Nagad' && 'নগদ (Nagad)'}
                    {method === 'Rocket' && 'রকেট (Rocket)'}
                    {method === 'Binance USDT' && 'USDT (TRC-20)'}
                  </button>
                ))}
              </div>
            </div>

            {/* Account Number / Wallet */}
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                {paymentMethod === 'Binance USDT' ? 'USDT (TRC20) Wallet Address:' : 'আপনার বিকাশ / নগদ / রকেট পার্সোনাল নাম্বার:'}
              </label>
              <input
                type="text"
                value={accountNumber}
                onChange={(e) => setAccountNumber(e.target.value)}
                placeholder={paymentMethod === 'Binance USDT' ? 'T...' : '017XXXXXXXX'}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-xs sm:text-sm font-medium focus:outline-none focus:ring-2 focus:ring-emerald-500"
                required
              />
            </div>

            {/* Amount */}
            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="text-xs font-bold text-slate-700">
                  উইথড্রয়াল অ্যামাউন্ট (USD):
                </label>
                <button
                  type="button"
                  onClick={() => setWithdrawAmount(currentUser.workerBalance.toFixed(2))}
                  className="text-[11px] text-emerald-600 hover:underline font-semibold"
                >
                  সর্বোচ্চ (${currentUser.workerBalance.toFixed(2)})
                </button>
              </div>
              <div className="relative">
                <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 font-bold">$</span>
                <input
                  type="number"
                  step="0.10"
                  min={config.minWithdrawalUSD}
                  max={currentUser.workerBalance}
                  value={withdrawAmount}
                  onChange={(e) => setWithdrawAmount(e.target.value)}
                  className="w-full pl-8 pr-28 py-2.5 rounded-xl border border-slate-300 text-sm font-bold focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  required
                />
                <div className="absolute right-3.5 top-1/2 -translate-y-1/2 text-xs font-bold text-emerald-700">
                  ≈ ৳{bdtCalculated} BDT
                </div>
              </div>
            </div>

            {/* Fee Breakdown Display */}
            {parsedAmount > 0 && (
              <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200 text-xs space-y-1.5">
                <div className="flex justify-between text-slate-600">
                  <span>উইথড্রয়াল পরিমাণ:</span>
                  <span className="font-bold text-slate-800">${parsedAmount.toFixed(2)} USD (৳{bdtCalculated})</span>
                </div>
                <div className="flex justify-between text-slate-500">
                  <span>ওয়েবসাইট ফি ({withdrawFeePercent}%):</span>
                  <span className="font-semibold text-rose-600">-${withdrawFeeUSD.toFixed(2)} (৳{feeBdtCalculated})</span>
                </div>
                <div className="border-t border-slate-200 pt-1.5 flex justify-between font-bold text-slate-900">
                  <span>আপনি রিসিভ করবেন:</span>
                  <span className="text-emerald-700 font-extrabold text-sm">${netWithdrawUSD.toFixed(2)} USD (৳{netBdtCalculated} BDT)</span>
                </div>
              </div>
            )}

            {/* Submit Button */}
            <button
              type="submit"
              disabled={currentUser.workerBalance < config.minWithdrawalUSD}
              className="w-full py-3 rounded-2xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs sm:text-sm font-bold shadow-md shadow-emerald-200 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              <ArrowUpRight className="w-4 h-4" />
              <span>উইথড্রয়াল রিকোয়েস্ট পাঠান (৳{netBdtCalculated})</span>
            </button>
          </form>
        </div>

        {/* Right: Payment Instructions & Rules */}
        <div className="lg:col-span-5 bg-slate-50 rounded-3xl p-6 border border-slate-200 space-y-4">
          <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider">
            উইথড্রয়াল নির্দেশিকা ও নিয়ম
          </h3>

          <div className="space-y-3 text-xs text-slate-600">
            <div className="flex items-start gap-2.5">
              <span className="w-5 h-5 rounded-full bg-emerald-100 text-emerald-800 text-[11px] font-bold flex items-center justify-center shrink-0 mt-0.5">
                ১
              </span>
              <span>রিকোয়েস্ট করার সাধারণত ১ থেকে ২৪ ঘণ্টার মধ্যে এডমিন যাচাই করে টাকা পাঠিয়ে দেয়।</span>
            </div>

            <div className="flex items-start gap-2.5">
              <span className="w-5 h-5 rounded-full bg-emerald-100 text-emerald-800 text-[11px] font-bold flex items-center justify-center shrink-0 mt-0.5">
                ২
              </span>
              <span>বিকাশ ও নগদের ক্ষেত্রে সবসময় ব্যক্তিগত (Personal) নম্বর প্রদান করবেন।</span>
            </div>

            <div className="flex items-start gap-2.5">
              <span className="w-5 h-5 rounded-full bg-emerald-100 text-emerald-800 text-[11px] font-bold flex items-center justify-center shrink-0 mt-0.5">
                ৩
              </span>
              <span>কোনো ভুল নম্বর দিলে টাকা না পৌঁছালে প্ল্যাটফর্ম কর্তৃপক্ষ দায়ী থাকবে না।</span>
            </div>
          </div>

          <div className="bg-white p-4 rounded-2xl border border-slate-200 text-xs">
            <div className="flex items-center gap-2 font-bold text-slate-900 mb-1">
              <HelpCircle className="w-4 h-4 text-emerald-600" />
              <span>সহায়তা বা সমস্যা?</span>
            </div>
            <p className="text-slate-500">
              উইথড্রয়াল সংক্রান্ত যেকোনো সহায়তার জন্য এডমিন সাপোর্টে যোগাযোগ করতে পারেন।
            </p>
          </div>
        </div>

      </div>

      {/* Withdrawal History Table */}
      <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-xs">
        <h3 className="text-sm font-bold text-slate-900 mb-4">
          উইথড্রয়াল হিস্ট্রি (Withdrawal History)
        </h3>

        {myTransactions.length === 0 ? (
          <div className="text-center py-8 text-slate-400 text-xs">
            এখনো কোনো উইথড্রয়াল রিকোয়েস্ট করা হয়নি।
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 text-slate-500 uppercase text-[10px] border-y border-slate-100">
                <tr>
                  <th className="py-2.5 px-3">তারিখ</th>
                  <th className="py-2.5 px-3">মেথড ও নম্বর</th>
                  <th className="py-2.5 px-3">পরিমাণ (USD)</th>
                  <th className="py-2.5 px-3">টাকা (BDT)</th>
                  <th className="py-2.5 px-3">স্ট্যাটাস</th>
                  <th className="py-2.5 px-3">ট্রানজেকশন নোট</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-slate-700">
                {myTransactions.map(tx => (
                  <tr key={tx.id} className="hover:bg-slate-50/60">
                    <td className="py-3 px-3 text-slate-400 whitespace-nowrap">{tx.date}</td>
                    <td className="py-3 px-3 font-semibold">
                      <span>{tx.method}</span>
                      <span className="block text-[11px] text-slate-400 font-normal">{tx.accountDetails}</span>
                    </td>
                    <td className="py-3 px-3 font-bold text-slate-900">${tx.amount.toFixed(2)}</td>
                    <td className="py-3 px-3 font-bold text-emerald-700">৳{(tx.amount * config.dollarRateInBDT).toFixed(0)}</td>
                    <td className="py-3 px-3">
                      {tx.status === 'completed' && (
                        <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800">
                          পরিশোধিত (Paid)
                        </span>
                      )}
                      {tx.status === 'pending' && (
                        <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-100 text-amber-800">
                          প্রসেসিং (Pending)
                        </span>
                      )}
                      {tx.status === 'rejected' && (
                        <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-rose-100 text-rose-800">
                          বাতিল (Rejected)
                        </span>
                      )}
                    </td>
                    <td className="py-3 px-3 text-slate-500">{tx.note || (tx.txId ? `TrxID: ${tx.txId}` : '-')}</td>
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
