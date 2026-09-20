import { Job, TaskSubmission, UserProfile, WalletTransaction, PlatformConfig } from '../types';

export const INITIAL_CONFIG: PlatformConfig = {
  platformFeePercent: 10,
  withdrawalFeePercent: 5,
  minWithdrawalUSD: 1.5,
  autoApproveHours: 48,
  dollarRateInBDT: 122,
  referralCommissionPercent: 5,
  announcement: 'স্বাগতম! সঠিক প্রুফ ও স্ক্রিনশট জমা দিন। রেফার লিংক বন্ধুদের সাথে শেয়ার করে লাইফটাইম ৫% কমিশন উপভোগ করুন।'
};

export const INITIAL_USER: UserProfile = {
  id: 'user_main_1',
  name: 'তানভীর আহমেদ',
  email: 'tanvir@microjob.pro',
  avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&auto=format&fit=crop&q=80',
  workerBalance: 5.60,
  pendingBalance: 1.15,
  employerBalance: 24.50,
  successRate: 98,
  completedTasksCount: 46,
  joinedAt: '2026-08-10',
  phone: '01712-345678',
  referralCode: 'TANVIR99',
  referralEarnings: 2.85,
  referredUsers: [
    {
      id: 'ref_1',
      name: 'রাকিবুল হাসান',
      avatar: 'https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?w=100&auto=format&fit=crop&q=80',
      joinedAt: '2026-09-02',
      tasksCompleted: 28,
      commissionGenerated: 1.40
    },
    {
      id: 'ref_2',
      name: 'নিলয় চৌধুরী',
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&auto=format&fit=crop&q=80',
      joinedAt: '2026-09-10',
      tasksCompleted: 19,
      commissionGenerated: 0.95
    },
    {
      id: 'ref_3',
      name: 'তানিয়া রহমান',
      avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&auto=format&fit=crop&q=80',
      joinedAt: '2026-09-15',
      tasksCompleted: 10,
      commissionGenerated: 0.50
    }
  ]
};

export const INITIAL_JOBS: Job[] = [
  {
    id: 'job_101',
    title: 'ইউটিউব ভিডিও ৩ মিনিট দেখা + লাইক + চ্যানেল সাবস্ক্রাইব',
    category: 'YouTube',
    employerId: 'user_other_1',
    employerName: 'টেক গুরু বাংলাদেশ',
    rewardPerWorker: 0.06,
    totalWorkersNeeded: 100,
    completedWorkers: 68,
    region: 'Bangladesh',
    estimatedMinutes: 4,
    description: 'আমাদের টেক রিভিউ ইউটিউব চ্যানেলে গিয়ে নির্ধারিত ভিডিওটি সম্পূর্ণ মনোযোগ দিয়ে অন্তত ৩ মিনিট দেখুন। ভিডিওতে একটি প্রাসঙ্গিক কমেন্ট করুন এবং চ্যানেলটি সাবস্ক্রাইব করুন।',
    steps: [
      'ইউটিউবে গিয়ে সার্চ করুন: "TechBangla AI Review 2026"',
      'লাল লোগোওয়ালা ভিডিওটি ওপেন করুন',
      'ভিডিওটি না টেনে অন্তত ৩ মিনিট দেখুন',
      'ভিডিওতে লাইক দিন এবং পজিটিভ মন্তব্য (comment) করুন',
      'চ্যানেলটি সাবস্ক্রাইব করুন ও বেল আইকন অন করুন'
    ],
    requiredProofs: [
      {
        id: 'p1',
        instruction: 'আপনার ইউটিউব চ্যানেলের ইউজারনেম বা হ্যান্ডেল (@handle) লিখুন',
        type: 'text'
      },
      {
        id: 'p2',
        instruction: '৩ মিনিট দেখার পর লাইক এবং সাবস্ক্রাইব করা অবস্থার স্ক্রিনশট আপলোড করুন',
        type: 'screenshot'
      }
    ],
    status: 'active',
    createdAt: '2026-09-18 14:30',
    isFeatured: true,
    autoApproveHours: 48
  },
  {
    id: 'job_102',
    title: 'ফেসবুক পেজ ফলো এবং পিন পোস্টে লাইক + ৩টি গ্রুপে শেয়ার',
    category: 'Facebook & Social',
    employerId: 'user_other_2',
    employerName: 'স্মার্ট গ্যাজেট বিডি',
    rewardPerWorker: 0.04,
    totalWorkersNeeded: 150,
    completedWorkers: 94,
    region: 'Bangladesh',
    estimatedMinutes: 3,
    description: 'আমাদের ই-কমার্স ফেসবুক পেজ ফলো করুন এবং প্রথম পিন পোস্টটিতে লাভ রিঅ্যাক্ট দিয়ে অন্তত ৩টি পাবলিক গ্রুপে শেয়ার করুন।',
    steps: [
      'Facebook পেজ ওপেন করুন: fb.com/smartgadgetbd',
      'পেজে লাইক ও ফলো বাটনে ক্লিক করুন',
      'পিন পোস্টটিতে লাইক ও কমেন্ট করুন',
      'পোস্টটি ৩টি ফেসবুক গ্রুপে শেয়ার করুন'
    ],
    requiredProofs: [
      {
        id: 'p1',
        instruction: 'আপনার ফেসবুক প্রোফাইল নাম ও লিংক',
        type: 'text'
      },
      {
        id: 'p2',
        instruction: 'পেজ ফলো ও গ্রুপ শেয়ারের স্পষ্ট স্ক্রিনশট আপলোড করুন',
        type: 'screenshot'
      }
    ],
    status: 'active',
    createdAt: '2026-09-19 10:15',
    isFeatured: true,
    autoApproveHours: 48
  },
  {
    id: 'job_103',
    title: 'প্লে স্টোর থেকে অ্যাপ ইনস্টল + ৫ স্টার রেটিং ও পজিটিভ রিভিউ',
    category: 'Mobile App Install',
    employerId: 'user_main_1', // posted by this user so user can see "My Posted Jobs" in action too!
    employerName: 'তানভীর আহমেদ',
    rewardPerWorker: 0.15,
    totalWorkersNeeded: 40,
    completedWorkers: 22,
    region: 'International',
    estimatedMinutes: 5,
    description: 'Google Play Store থেকে আমাদের "QuickLearn BD" এডুকেশন অ্যাপটি ইনস্টল করুন, ২ মিনিট অ্যাপের ভেতর ঘুরে ৫ স্টার রেটিং দিয়ে সুন্দর ৩ লাইনের রিভিউ দিন।',
    steps: [
      'Play Store-এ গিয়ে সার্চ করুন "QuickLearn BD"',
      'অ্যাপটি ডাউনলোড ও ইনস্টল করে ওপেন করুন',
      'গেস্ট অথবা জিমেইল দিয়ে সাইন ইন করে ২ মিনিট ব্যবহার করুন',
      'Play Store-এ এসে ৫ স্টার দিন এবং ৩ বাক্যের পজিটিভ রিভিউ লিখুন'
    ],
    requiredProofs: [
      {
        id: 'p1',
        instruction: 'যে জিমেইল / নাম থেকে রিভিউ দিয়েছেন সেই নাম লিখুন',
        type: 'text'
      },
      {
        id: 'p2',
        instruction: 'Play Store-এ রিভিউ সাবমিট হওয়ার স্ক্রিনশট',
        type: 'screenshot'
      }
    ],
    status: 'active',
    createdAt: '2026-09-19 18:00',
    isFeatured: false,
    autoApproveHours: 48
  },
  {
    id: 'job_104',
    title: 'ব্লগ ভিজিট + ২টি আর্টিকেলে ২ মিনিট স্ক্রল + গুগল বিজ্ঞাপন ক্লিক',
    category: 'SEO & Web Visit',
    employerId: 'user_other_3',
    employerName: 'গ্লোবাল ব্লগ নেটওয়ার্ক',
    rewardPerWorker: 0.05,
    totalWorkersNeeded: 200,
    completedWorkers: 145,
    region: 'International',
    estimatedMinutes: 4,
    description: 'গুগল অর্গানিক সার্চ থেকে আমাদের ওয়েবসাইট ভিজিট করুন। অন্তত ২টি পেজ ধীরে ধীরে স্ক্রল করে পড়ুন এবং যেকোনো একটি গুগল বিজ্ঞাপনে ক্লিক করে ৩০ সেকেন্ড থাকুন।',
    steps: [
      'Google.com এ যান এবং সার্চ করুন: "Best freelance skills 2026 techguide"',
      'techguidebd.xyz সাইটটি খুঁজে বের করে ক্লিক করুন',
      'হোমপেজ এবং আরও একটি ইন্টারনাল পোস্ট ১ মিনিট স্ক্রল করুন',
      'যেকোনো একটি ব্যানার বিজ্ঞাপনে ক্লিক করে ৩০ সেকেন্ড অপেক্ষা করুন'
    ],
    requiredProofs: [
      {
        id: 'p1',
        instruction: 'বিজ্ঞাপনে ক্লিক করার পর ব্রাউজার ইউআরএল (URL) পেস্ট করুন',
        type: 'text'
      },
      {
        id: 'p2',
        instruction: 'ব্রাউজারের হিস্ট্রি (History) পেজের স্ক্রিনশট আপলোড করুন',
        type: 'screenshot'
      }
    ],
    status: 'active',
    createdAt: '2026-09-19 22:45',
    isFeatured: false,
    autoApproveHours: 48
  },
  {
    id: 'job_105',
    title: 'নতুন ক্রিপ্টো প্ল্যাটফর্মে জিমেইল দিয়ে ফ্রি সাইন আপ ও ইমেইল ভেরিফাই',
    category: 'Sign Up & Referral',
    employerId: 'user_other_4',
    employerName: 'ক্রিপ্টো ওয়েভ',
    rewardPerWorker: 0.20,
    totalWorkersNeeded: 80,
    completedWorkers: 40,
    region: 'International',
    estimatedMinutes: 6,
    description: 'আমাদের প্রদত্ত রেফারেল লিংক দিয়ে নতুন একটি ফ্রি ডেমো ট্রেডিং অ্যাকাউন্টে সাইন আপ করুন এবং ইমেইলে পাঠানো ওটিপি বা কনফার্মেশন লিংকে ক্লিক করে ভেরিফাই করুন।',
    steps: [
      'প্রদত্ত রেফারেল লিংকে ক্লিক করুন: bit.ly/crypto-demo-reg',
      'আপনার জিমেইল দিয়ে অ্যাকাউন্ট রেজিস্ট্রেশন করুন',
      'ইমেইলের ইনবক্স চেক করে Verify লিংকে ক্লিক করুন',
      'ড্যাশবোর্ডে লগইন করে প্রোফাইল স্ক্রিন দেখুন'
    ],
    requiredProofs: [
      {
        id: 'p1',
        instruction: 'যে ইমেইল দিয়ে রেজিস্টার করেছেন সেই ইমেইল অ্যাড্রেস লিখুন',
        type: 'text'
      },
      {
        id: 'p2',
        instruction: 'ড্যাশবোর্ডে "Email Verified" দেখাচ্ছে এমন প্রোফাইল পেজের স্ক্রিনশট',
        type: 'screenshot'
      }
    ],
    status: 'active',
    createdAt: '2026-09-20 08:30',
    isFeatured: true,
    autoApproveHours: 48
  },
  {
    id: 'job_106',
    title: 'অফিসিয়াল টেলিগ্রাম চ্যানেলে জয়েন করুন ও পিন পোস্টে রিঅ্যাক্ট দিন',
    category: 'Telegram / Discord',
    employerId: 'user_other_5',
    employerName: 'ট্রেডিং হাব বিডি',
    rewardPerWorker: 0.03,
    totalWorkersNeeded: 300,
    completedWorkers: 110,
    region: 'Asia',
    estimatedMinutes: 2,
    description: 'আমাদের অফিশিয়াল ট্রেডিং ও সিগন্যাল টেলিগ্রাম চ্যানেলে জয়েন করুন এবং শেষ ৫টি পোস্টে রিঅ্যাকশন (👍 / 🔥) দিন।',
    steps: [
      'টেলিগ্রাম লিংক ওপেন করুন: t.me/bangla_crypto_hub',
      'চ্যানেলে "Join Channel" বাটনে ক্লিক করুন',
      'পিন করা পোস্টে 🔥 রিঅ্যাক্ট দিন'
    ],
    requiredProofs: [
      {
        id: 'p1',
        instruction: 'আপনার টেলিগ্রাম ইউজারনেম (@username)',
        type: 'text'
      },
      {
        id: 'p2',
        instruction: 'চ্যানেলে জয়েন করা অবস্থার স্ক্রিনশট',
        type: 'screenshot'
      }
    ],
    status: 'active',
    createdAt: '2026-09-20 09:10',
    isFeatured: false,
    autoApproveHours: 48
  }
];

export const INITIAL_SUBMISSIONS: TaskSubmission[] = [
  {
    id: 'sub_501',
    jobId: 'job_101',
    jobTitle: 'ইউটিউব ভিডিও ৩ মিনিট দেখা + লাইক + চ্যানেল সাবস্ক্রাইব',
    workerId: 'user_main_1',
    workerName: 'তানভীর আহমেদ',
    employerId: 'user_other_1',
    reward: 0.06,
    proofs: [
      {
        proofId: 'p1',
        instruction: 'আপনার ইউটিউব চ্যানেলের ইউজারনেম বা হ্যান্ডেল (@handle) লিখুন',
        type: 'text',
        value: '@tanvir_bd_gamer'
      },
      {
        proofId: 'p2',
        instruction: '৩ মিনিট দেখার পর লাইক এবং সাবস্ক্রাইব করা অবস্থার স্ক্রিনশট আপলোড করুন',
        type: 'screenshot',
        value: 'https://images.unsplash.com/photo-1611162617474-5b21e879e113?w=600&auto=format&fit=crop&q=80'
      }
    ],
    status: 'approved',
    submittedAt: '2026-09-19 16:40',
    reviewedAt: '2026-09-19 18:20'
  },
  {
    id: 'sub_502',
    jobId: 'job_102',
    jobTitle: 'ফেসবুক পেজ ফলো এবং পিন পোস্টে লাইক + ৩টি গ্রুপে শেয়ার',
    workerId: 'user_main_1',
    workerName: 'তানভীর আহমেদ',
    employerId: 'user_other_2',
    reward: 0.04,
    proofs: [
      {
        proofId: 'p1',
        instruction: 'আপনার ফেসবুক প্রোফাইল নাম ও লিংক',
        type: 'text',
        value: 'Tanvir Ahmed (fb.com/tanvir.ahmed.sample)'
      },
      {
        proofId: 'p2',
        instruction: 'পেজ ফলো ও গ্রুপ শেয়ারের স্পষ্ট স্ক্রিনশট আপলোড করুন',
        type: 'screenshot',
        value: 'https://images.unsplash.com/photo-1563986768609-322da13575f3?w=600&auto=format&fit=crop&q=80'
      }
    ],
    status: 'pending',
    submittedAt: '2026-09-20 08:15'
  },
  // Someone else submitted to Tanvir's job (so Tanvir as employer can review!)
  {
    id: 'sub_503',
    jobId: 'job_103',
    jobTitle: 'প্লে স্টোর থেকে অ্যাপ ইনস্টল + ৫ স্টার রেটিং ও পজিটিভ রিভিউ',
    workerId: 'user_worker_rafiq',
    workerName: 'মো: রফিকুল ইসলাম',
    employerId: 'user_main_1', // posted by Tanvir!
    reward: 0.15,
    proofs: [
      {
        proofId: 'p1',
        instruction: 'যে জিমেইল / নাম থেকে রিভিউ দিয়েছেন সেই নাম লিখুন',
        type: 'text',
        value: 'Rafiqul Tech (rafiqul.review@gmail.com)'
      },
      {
        proofId: 'p2',
        instruction: 'Play Store-এ রিভিউ সাবমিট হওয়ার স্ক্রিনশট',
        type: 'screenshot',
        value: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=600&auto=format&fit=crop&q=80'
      }
    ],
    status: 'pending',
    submittedAt: '2026-09-20 09:20'
  }
];

export const INITIAL_TRANSACTIONS: WalletTransaction[] = [
  {
    id: 'tx_901',
    userId: 'user_main_1',
    userName: 'তানভীর আহমেদ',
    type: 'withdrawal',
    amount: 3.50,
    method: 'bKash',
    accountDetails: '01712-345678 (Personal)',
    txId: 'BKASH98274102',
    status: 'completed',
    date: '2026-09-18 19:25',
    note: 'উইথড্রয়াল সফল হয়েছে (৳427 প্রদান করা হয়েছে)'
  },
  {
    id: 'tx_902',
    userId: 'user_main_1',
    userName: 'তানভীর আহমেদ',
    type: 'deposit',
    amount: 25.00,
    method: 'Nagad',
    accountDetails: '01712-345678',
    txId: 'NGD882039121',
    status: 'completed',
    date: '2026-09-17 11:30',
    note: 'জব পোস্টিং ডিপোজিট ব্যালেন্সে যোগ হয়েছে (৳3,050)'
  },
  {
    id: 'tx_903',
    userId: 'user_main_1',
    userName: 'তানভীর আহমেদ',
    type: 'referral_bonus',
    amount: 1.40,
    status: 'completed',
    date: '2026-09-19 14:00',
    note: 'রেফারেল বোনাস অর্জিত (রাকিবুল হাসানের টাস্ক কমিশন)'
  }
];
