import React, { useState } from 'react';
import { 
  X, 
  Globe, 
  Download, 
  ExternalLink, 
  CheckCircle2, 
  Terminal, 
  Server, 
  CreditCard, 
  ArrowRight,
  ShieldCheck,
  Smartphone,
  Copy,
  Check
} from 'lucide-react';

interface PublishGuideModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const PublishGuideModal: React.FC<PublishGuideModalProps> = ({ isOpen, onClose }) => {
  const [activeTab, setActiveTab] = useState<'vercel' | 'github' | 'cloudrun' | 'domain' | 'payment'>('vercel');
  const [copiedCmd, setCopiedCmd] = useState('');

  if (!isOpen) return null;

  const copyCode = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedCmd(text);
    setTimeout(() => setCopiedCmd(''), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-xs animate-in fade-in">
      <div className="bg-white w-full max-w-4xl rounded-3xl shadow-2xl border border-slate-200 overflow-hidden flex flex-col max-h-[90vh]">
        
        {/* Header */}
        <div className="bg-linear-to-r from-slate-900 via-slate-800 to-indigo-950 text-white p-6 relative flex items-center justify-between border-b border-slate-800">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-300 text-xs font-semibold mb-2 border border-emerald-500/30">
              <Globe className="w-3.5 h-3.5" />
              <span>ডিপ্লয়মেন্ট ও পাবলিশ নির্দেশিকা</span>
            </div>
            <h2 className="text-xl sm:text-2xl font-black">
              আপনার ওয়েবসাইট কীভাবে ইন্টারনেটে লাইভ ও পাবলিশ করবেন?
            </h2>
            <p className="text-xs sm:text-sm text-slate-300 mt-1">
              সম্পূর্ণ ফ্রি ও পেশাদার উপায়ে এই কোডটি গিটহাব, ভার্সেল বা ক্লাউড রানে হোস্ট করার সহজ বাংলা গাইড।
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-2xl bg-white/10 hover:bg-white/20 text-slate-300 hover:text-white transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Navigation */}
        <div className="flex border-b border-slate-200 bg-slate-50 px-6 pt-3 gap-2 overflow-x-auto">
          {[
            { id: 'vercel', label: '১. Vercel-এ ফ্রি পাবলিশ (সবচেয়ে সহজ)', icon: <Globe className="w-4 h-4" /> },
            { id: 'github', label: '২. কোড ডাউনলোড বা গিটহাব', icon: <Download className="w-4 h-4" /> },
            { id: 'cloudrun', label: '৩. Google Cloud Run', icon: <Server className="w-4 h-4" /> },
            { id: 'domain', label: '৪. কাস্টম ডোমেইন (.com)', icon: <ExternalLink className="w-4 h-4" /> },
            { id: 'payment', label: '৫. বিকাশ/নগদ নম্বর সেটআপ', icon: <Smartphone className="w-4 h-4" /> },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`flex items-center gap-2 px-4 py-2.5 text-xs font-bold rounded-t-xl transition-all whitespace-nowrap border-b-2 ${
                activeTab === tab.id
                  ? 'border-emerald-600 text-emerald-700 bg-white shadow-xs'
                  : 'border-transparent text-slate-600 hover:text-slate-900 hover:bg-slate-100/70'
              }`}
            >
              {tab.icon}
              <span>{tab.label}</span>
            </button>
          ))}
        </div>

        {/* Modal Body */}
        <div className="p-6 overflow-y-auto space-y-6 text-slate-700 text-xs sm:text-sm leading-relaxed">
          
          {/* TAB 1: Vercel */}
          {activeTab === 'vercel' && (
            <div className="space-y-4">
              <div className="bg-emerald-50 border border-emerald-200 rounded-2xl p-4 flex items-start gap-3">
                <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
                <div>
                  <h4 className="font-bold text-slate-900 text-sm">Vercel হোস্টিং কেন সেরা?</h4>
                  <p className="text-xs text-slate-600 mt-1">
                    Vercel সম্পূর্ণ <strong>ফ্রি</strong>, কোনো সার্ভার ফি লাগে না, অটোমেটিক ফ্রি SSL (https://) দেয় এবং React + Vite প্রোজেক্টের জন্য বিশ্বখ্যাত।
                  </p>
                </div>
              </div>

              <div className="space-y-3">
                <h4 className="font-bold text-slate-900 text-sm">সহজ ৪টি ধাপ:</h4>
                
                <div className="p-3.5 bg-slate-50 rounded-2xl border border-slate-200 space-y-1">
                  <span className="font-bold text-emerald-700 block">ধাপ ১: কোড এক্সপোর্ট করুন</span>
                  <p className="text-xs text-slate-600">
                    AI Studio-এর উপরের ডান পাশের সেটিংস (Settings) আইকনে ক্লিক করে <strong>"Export to GitHub"</strong> সিলেক্ট করুন। এটি আপনার গিটহাবে একটি নতুন রিপোজিটোরি বানিয়ে দেবে।
                  </p>
                </div>

                <div className="p-3.5 bg-slate-50 rounded-2xl border border-slate-200 space-y-1">
                  <span className="font-bold text-emerald-700 block">ধাপ ২: Vercel-এ অ্যাকাউন্ট খুলুন</span>
                  <p className="text-xs text-slate-600">
                    <strong>vercel.com</strong>-এ যান এবং আপনার GitHub অ্যাকাউন্ট দিয়ে "Sign Up / Log In" করুন।
                  </p>
                </div>

                <div className="p-3.5 bg-slate-50 rounded-2xl border border-slate-200 space-y-1">
                  <span className="font-bold text-emerald-700 block">ধাপ ৩: প্রজেক্ট ইমপোর্ট করুন</span>
                  <p className="text-xs text-slate-600">
                    Vercel ড্যাশবোর্ডে <strong>"Add New Project"</strong> বাটন পাবেন। সেখান থেকে আপনার এক্সপোর্ট করা রিপোজিটোরিটি সিলেক্ট করে <strong>"Deploy"</strong> বাটনে ক্লিক করুন।
                  </p>
                </div>

                <div className="p-3.5 bg-slate-50 rounded-2xl border border-slate-200 space-y-1">
                  <span className="font-bold text-emerald-700 block">ধাপ ৪: লাইভ লিংক উপভোগ করুন!</span>
                  <p className="text-xs text-slate-600">
                    মাত্র ১ মিনিটের মধ্যে আপনার জন্য একটি সুরক্ষিত লাইভ লিংক তৈরি হয়ে যাবে (যেমন: <code>your-site.vercel.app</code>)।
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: GitHub & Local Run */}
          {activeTab === 'github' && (
            <div className="space-y-4">
              <h4 className="font-bold text-slate-900 text-sm">আপনার নিজের কম্পিউটারে চালানোর নিয়ম:</h4>
              <p className="text-xs text-slate-600">
                প্রোজেক্টটি জিপ হিসেবে ডাউনলোড করে আপনার লোকাল কম্পিউটারে রান করতে চাইলে নিচের কমান্ডগুলো টার্মিনালে চালান:
              </p>

              <div className="space-y-3">
                <div>
                  <span className="font-bold text-xs text-slate-800 block mb-1">১. ডিপেন্ডেন্সি ইনস্টল করুন:</span>
                  <div className="bg-slate-900 text-emerald-400 p-3 rounded-xl font-mono text-xs flex items-center justify-between">
                    <span>npm install</span>
                    <button onClick={() => copyCode('npm install')} className="text-slate-400 hover:text-white">
                      {copiedCmd === 'npm install' ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
                    </button>
                  </div>
                </div>

                <div>
                  <span className="font-bold text-xs text-slate-800 block mb-1">২. লোকাল সার্ভার চালু করুন:</span>
                  <div className="bg-slate-900 text-emerald-400 p-3 rounded-xl font-mono text-xs flex items-center justify-between">
                    <span>npm run dev</span>
                    <button onClick={() => copyCode('npm run dev')} className="text-slate-400 hover:text-white">
                      {copiedCmd === 'npm run dev' ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
                    </button>
                  </div>
                </div>

                <div>
                  <span className="font-bold text-xs text-slate-800 block mb-1">৩. প্রোডাকশন বিল্ড তৈরি করুন:</span>
                  <div className="bg-slate-900 text-emerald-400 p-3 rounded-xl font-mono text-xs flex items-center justify-between">
                    <span>npm run build</span>
                    <button onClick={() => copyCode('npm run build')} className="text-slate-400 hover:text-white">
                      {copiedCmd === 'npm run build' ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB 3: Google Cloud Run */}
          {activeTab === 'cloudrun' && (
            <div className="space-y-4">
              <h4 className="font-bold text-slate-900 text-sm">Google AI Studio থেকে সরাসরি ক্লাউড রানে ডিপ্লয়:</h4>
              <p className="text-xs text-slate-600">
                গুগল ক্লাউড রান হলো গুগল পরিচালিত অত্যন্ত পাওয়ারফুল ও সুরক্ষিত কন্টেইনার সার্ভিস।
              </p>

              <div className="space-y-2.5">
                <div className="flex items-start gap-2.5 p-3 rounded-xl bg-slate-50 border border-slate-200">
                  <span className="w-5 h-5 rounded-full bg-slate-900 text-white flex items-center justify-center font-bold text-xs shrink-0">1</span>
                  <span>AI Studio-এর ডানদিকের উপরের মেনু থেকে <strong>"Deploy to Cloud Run"</strong> অপশনে ক্লিক করুন।</span>
                </div>
                <div className="flex items-start gap-2.5 p-3 rounded-xl bg-slate-50 border border-slate-200">
                  <span className="w-5 h-5 rounded-full bg-slate-900 text-white flex items-center justify-center font-bold text-xs shrink-0">2</span>
                  <span>আপনার গুগল ক্লাউড প্রোজেক্ট সিলেক্ট করে অথরাইজ করুন।</span>
                </div>
                <div className="flex items-start gap-2.5 p-3 rounded-xl bg-slate-50 border border-slate-200">
                  <span className="w-5 h-5 rounded-full bg-slate-900 text-white flex items-center justify-center font-bold text-xs shrink-0">3</span>
                  <span>কয়েক মিনিটের মধ্যে গুগল ক্লাউড অটোমেটিক ডকার ইমেজ বিল্ড করে আপনাকে একটি অফিশিয়াল লাইভ লিংক দেবে।</span>
                </div>
              </div>
            </div>
          )}

          {/* TAB 4: Custom Domain */}
          {activeTab === 'domain' && (
            <div className="space-y-4">
              <h4 className="font-bold text-slate-900 text-sm">নিজের কাস্টম ডোমেইন (.com বা .xyz) কীভাবে যুক্ত করবেন?</h4>
              
              <div className="space-y-3">
                <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
                  <strong className="block text-slate-900 text-xs mb-1">১. ডোমেইন কিনুন:</strong>
                  <span className="text-xs text-slate-600">
                    Namecheap, GoDaddy, Hostinger অথবা যেকোনো দেশীয় প্রোভাইডার থেকে আপনার পছন্দের ডোমেইন (যেমন: <code>microjobbd.com</code>) কিনুন।
                  </span>
                </div>

                <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
                  <strong className="block text-slate-900 text-xs mb-1">২. DNS রেকর্ড সেট করুন:</strong>
                  <span className="text-xs text-slate-600">
                    যদি Vercel ব্যবহার করেন, Vercel Project Settings &gt; Domains-এ গিয়ে আপনার ডোমেইন লিখুন। Vercel আপনাকে একটি <strong>A Record (76.76.21.21)</strong> অথবা <strong>CNAME</strong> দেবে, যা আপনার ডোমেইন কন্ট্রোল প্যানেলে যুক্ত করলেই ডোমেইন চালু হয়ে যাবে।
                  </span>
                </div>
              </div>
            </div>
          )}

          {/* TAB 5: Payment Info */}
          {activeTab === 'payment' && (
            <div className="space-y-4">
              <h4 className="font-bold text-slate-900 text-sm">আপনার নিজের বিকাশ ও নগদ নম্বর কীভাবে বসাবেন?</h4>
              
              <p className="text-xs text-slate-600">
                ইউজাররা যখন সাইটে "এড মানি / ডিপোজিট" করবে, তখন তারা যেন আপনার দেওয়া অফিশিয়াল নম্বর দেখতে পায়:
              </p>

              <div className="p-4 bg-amber-50 rounded-2xl border border-amber-200 space-y-2">
                <div className="flex items-center gap-2 font-bold text-amber-900 text-xs">
                  <Smartphone className="w-4 h-4 text-amber-700" />
                  <span>নম্বর পরিবর্তন করার ফাইল:</span>
                </div>
                <p className="text-xs font-mono text-slate-800 bg-white/80 p-2.5 rounded-xl border border-amber-200">
                  src/components/wallet/UnifiedWallet.tsx
                </p>
                <p className="text-xs text-slate-600">
                  এই ফাইলের ভেতর <code>01700-123456</code> (বিকাশ) এবং <code>01800-654321</code> (নগদ) খুঁজে নিয়ে সেখানে আপনার আসল মোবাইল ব্যাংকিং পার্সোনাল বা মার্চেন্ট নম্বর লিখে দিলে ইউজাররা আপনার নম্বরেই টাকা পাঠাবে।
                </p>
              </div>
            </div>
          )}

        </div>

        {/* Footer Action */}
        <div className="p-4 bg-slate-50 border-t border-slate-200 flex items-center justify-between text-xs text-slate-500">
          <span>প্রয়োজনে গিটহাবে এক্সপোর্ট করে যেকোনো সার্ভারে চালাতে পারেন।</span>
          <button
            onClick={onClose}
            className="px-5 py-2 rounded-xl bg-slate-900 text-white font-bold hover:bg-slate-800 transition-colors"
          >
            বুঝেছি, বন্ধ করুন
          </button>
        </div>

      </div>
    </div>
  );
};
