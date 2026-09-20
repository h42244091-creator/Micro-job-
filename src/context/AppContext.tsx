import React, { createContext, useContext, useState, useEffect } from 'react';
import { 
  Job, 
  TaskSubmission, 
  UserProfile, 
  WalletTransaction, 
  PlatformConfig, 
  NavTab, 
  PaymentMethod,
  SubmittedProofItem
} from '../types';
import { 
  INITIAL_CONFIG, 
  INITIAL_USER, 
  INITIAL_JOBS, 
  INITIAL_SUBMISSIONS, 
  INITIAL_TRANSACTIONS 
} from '../data/mockData';

interface AppContextType {
  currentUser: UserProfile;
  jobs: Job[];
  submissions: TaskSubmission[];
  transactions: WalletTransaction[];
  config: PlatformConfig;
  activeTab: NavTab;
  setActiveTab: (tab: NavTab) => void;
  
  // Actions
  submitTask: (jobId: string, proofs: SubmittedProofItem[]) => { success: boolean; message: string };
  createJob: (jobData: Omit<Job, 'id' | 'employerId' | 'employerName' | 'completedWorkers' | 'createdAt' | 'status'>) => { success: boolean; message: string };
  toggleJobStatus: (jobId: string) => void;
  reviewSubmission: (submissionId: string, status: 'approved' | 'rejected', rejectionReason?: string) => void;
  requestWithdrawal: (amount: number, method: PaymentMethod, accountDetails: string) => { success: boolean; message: string };
  requestDeposit: (amount: number, method: PaymentMethod, senderAccount: string, txId: string) => { success: boolean; message: string };
  claimReferralEarnings: () => { success: boolean; message: string };
  simulateNewReferral: (friendName: string) => void;
  resetDemoData: () => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentUser, setCurrentUser] = useState<UserProfile>(() => {
    const saved = localStorage.getItem('microjob_user');
    return saved ? JSON.parse(saved) : INITIAL_USER;
  });

  const [jobs, setJobs] = useState<Job[]>(() => {
    const saved = localStorage.getItem('microjob_jobs');
    return saved ? JSON.parse(saved) : INITIAL_JOBS;
  });

  const [submissions, setSubmissions] = useState<TaskSubmission[]>(() => {
    const saved = localStorage.getItem('microjob_submissions');
    return saved ? JSON.parse(saved) : INITIAL_SUBMISSIONS;
  });

  const [transactions, setTransactions] = useState<WalletTransaction[]>(() => {
    const saved = localStorage.getItem('microjob_transactions');
    return saved ? JSON.parse(saved) : INITIAL_TRANSACTIONS;
  });

  const [config] = useState<PlatformConfig>(INITIAL_CONFIG);
  const [activeTab, setActiveTab] = useState<NavTab>('browse_jobs');

  // Sync to localStorage
  useEffect(() => {
    localStorage.setItem('microjob_user', JSON.stringify(currentUser));
  }, [currentUser]);

  useEffect(() => {
    localStorage.setItem('microjob_jobs', JSON.stringify(jobs));
  }, [jobs]);

  useEffect(() => {
    localStorage.setItem('microjob_submissions', JSON.stringify(submissions));
  }, [submissions]);

  useEffect(() => {
    localStorage.setItem('microjob_transactions', JSON.stringify(transactions));
  }, [transactions]);

  // Submit task proof
  const submitTask = (jobId: string, proofs: SubmittedProofItem[]) => {
    const targetJob = jobs.find(j => j.id === jobId);
    if (!targetJob) return { success: false, message: 'জবটি খুঁজে পাওয়া যায়নি।' };

    // Check if already submitted
    const existing = submissions.find(s => s.jobId === jobId && s.workerId === currentUser.id);
    if (existing) {
      return { success: false, message: 'আপনি ইতোমধ্যে এই কাজে প্রুফ সাবমিট করেছেন।' };
    }

    const newSub: TaskSubmission = {
      id: `sub_${Date.now()}`,
      jobId: targetJob.id,
      jobTitle: targetJob.title,
      workerId: currentUser.id,
      workerName: currentUser.name,
      employerId: targetJob.employerId,
      reward: targetJob.rewardPerWorker,
      proofs,
      status: 'pending',
      submittedAt: new Date().toISOString().replace('T', ' ').slice(0, 16)
    };

    setSubmissions(prev => [newSub, ...prev]);

    // Update pending balance
    setCurrentUser(prev => ({
      ...prev,
      pendingBalance: Number((prev.pendingBalance + targetJob.rewardPerWorker).toFixed(2))
    }));

    return { success: true, message: 'আপনার প্রুফ সফলভাবে জমা হয়েছে! এমপ্লয়ার যাচাই করে পেমেন্ট অ্যাপ্রুভ করবেন।' };
  };

  // Create new micro job
  const createJob = (jobData: Omit<Job, 'id' | 'employerId' | 'employerName' | 'completedWorkers' | 'createdAt' | 'status'>) => {
    const workerCost = jobData.rewardPerWorker * jobData.totalWorkersNeeded;
    const platformFee = (workerCost * config.platformFeePercent) / 100;
    const totalCost = Number((workerCost + platformFee).toFixed(2));

    if (currentUser.employerBalance < totalCost) {
      return { 
        success: false, 
        message: `আপনার ডিপোজিট ব্যালেন্স অপর্যাপ্ত। মোট প্রয়োজন $${totalCost.toFixed(2)}, কিন্তু আছে $${currentUser.employerBalance.toFixed(2)}। দয়া করে ব্যালেন্স ডিপোজিট করুন।` 
      };
    }

    const newJob: Job = {
      ...jobData,
      id: `job_${Date.now()}`,
      employerId: currentUser.id,
      employerName: currentUser.name,
      completedWorkers: 0,
      status: 'active',
      createdAt: new Date().toISOString().replace('T', ' ').slice(0, 16)
    };

    // Deduct cost from employer balance
    setCurrentUser(prev => ({
      ...prev,
      employerBalance: Number((prev.employerBalance - totalCost).toFixed(2))
    }));

    // Record escrow transaction
    const escrowTx: WalletTransaction = {
      id: `tx_escrow_${Date.now()}`,
      userId: currentUser.id,
      userName: currentUser.name,
      type: 'job_escrow',
      amount: totalCost,
      status: 'completed',
      date: new Date().toISOString().replace('T', ' ').slice(0, 16),
      note: `জব পোস্টিং এসক্রো লক: "${jobData.title.slice(0, 24)}..."`
    };

    setJobs(prev => [newJob, ...prev]);
    setTransactions(prev => [escrowTx, ...prev]);

    return { 
      success: true, 
      message: `জবটি সফলভাবে লাইভ পোস্ট করা হয়েছে! মোট $${totalCost.toFixed(2)} এসক্রো লক করা হয়েছে।` 
    };
  };

  // Toggle Job Status (Pause / Resume)
  const toggleJobStatus = (jobId: string) => {
    setJobs(prev => prev.map(j => {
      if (j.id === jobId) {
        const nextStatus = j.status === 'active' ? 'paused' : 'active';
        return { ...j, status: nextStatus };
      }
      return j;
    }));
  };

  // Review submission (by employer)
  const reviewSubmission = (submissionId: string, status: 'approved' | 'rejected', rejectionReason?: string) => {
    setSubmissions(prev => prev.map(sub => {
      if (sub.id === submissionId) {
        return {
          ...sub,
          status,
          rejectionReason: status === 'rejected' ? (rejectionReason || 'প্রুফ সঠিক পাওয়া যায়নি') : undefined,
          reviewedAt: new Date().toISOString().replace('T', ' ').slice(0, 16)
        };
      }
      return sub;
    }));

    const targetSub = submissions.find(s => s.id === submissionId);
    if (!targetSub) return;

    if (status === 'approved') {
      // Increase job's completed workers count
      setJobs(prev => prev.map(j => {
        if (j.id === targetSub.jobId) {
          const newCompleted = j.completedWorkers + 1;
          return {
            ...j,
            completedWorkers: newCompleted,
            status: newCompleted >= j.totalWorkersNeeded ? 'completed' : j.status
          };
        }
        return j;
      }));

      // If current user is the worker, credit their worker balance
      if (targetSub.workerId === currentUser.id) {
        setCurrentUser(prev => ({
          ...prev,
          workerBalance: Number((prev.workerBalance + targetSub.reward).toFixed(2)),
          pendingBalance: Math.max(0, Number((prev.pendingBalance - targetSub.reward).toFixed(2))),
          completedTasksCount: prev.completedTasksCount + 1
        }));
      }
    } else if (status === 'rejected') {
      // If current user was worker, deduct from pending balance
      if (targetSub.workerId === currentUser.id) {
        setCurrentUser(prev => ({
          ...prev,
          pendingBalance: Math.max(0, Number((prev.pendingBalance - targetSub.reward).toFixed(2)))
        }));
      }
    }
  };

  // Request withdrawal (Cashout)
  const requestWithdrawal = (amount: number, method: PaymentMethod, accountDetails: string) => {
    if (amount < config.minWithdrawalUSD) {
      return { 
        success: false, 
        message: `নূন্যতম উত্তোলন সীমা $${config.minWithdrawalUSD.toFixed(2)} (৳${(config.minWithdrawalUSD * config.dollarRateInBDT).toFixed(0)})।` 
      };
    }

    if (currentUser.workerBalance < amount) {
      return { 
        success: false, 
        message: `আপনার আর্নিং ব্যালেন্স অপর্যাপ্ত। বর্তমান ব্যালেন্স: $${currentUser.workerBalance.toFixed(2)}` 
      };
    }

    // Website fee calculation on withdrawal
    const fee = Number(((amount * (config.withdrawalFeePercent || 5)) / 100).toFixed(2));
    const netAmount = Number((amount - fee).toFixed(2));

    // Deduct total amount from worker balance
    setCurrentUser(prev => ({
      ...prev,
      workerBalance: Number((prev.workerBalance - amount).toFixed(2))
    }));

    const newTx: WalletTransaction = {
      id: `tx_${Date.now()}`,
      userId: currentUser.id,
      userName: currentUser.name,
      type: 'withdrawal',
      amount,
      fee,
      netAmount,
      method,
      accountDetails,
      status: 'pending',
      date: new Date().toISOString().replace('T', ' ').slice(0, 16),
      note: `${method}-এ ক্যাশআউট ($${amount.toFixed(2)}) | ওয়েবসাইট ফি (${config.withdrawalFeePercent || 5}%): -$${fee.toFixed(2)} | আপনি পাবেন: $${netAmount.toFixed(2)} (৳${(netAmount * config.dollarRateInBDT).toFixed(0)})`
    };

    setTransactions(prev => [newTx, ...prev]);

    return { 
      success: true, 
      message: `$${amount.toFixed(2)} উইথড্রয়াল রিকোয়েস্ট সফল! ওয়েবসাইট ফি (${config.withdrawalFeePercent || 5}%): -$${fee.toFixed(2)} বাদে আপনি নেট $${netAmount.toFixed(2)} (৳${(netAmount * config.dollarRateInBDT).toFixed(0)}) পাবেন।` 
    };
  };

  // Request deposit
  const requestDeposit = (amount: number, method: PaymentMethod, senderAccount: string, txId: string) => {
    const newTx: WalletTransaction = {
      id: `tx_dep_${Date.now()}`,
      userId: currentUser.id,
      userName: currentUser.name,
      type: 'deposit',
      amount,
      method,
      accountDetails: senderAccount,
      txId,
      status: 'completed', // auto approved in demo
      date: new Date().toISOString().replace('T', ' ').slice(0, 16),
      note: `${method}-এর মাধ্যমে $${amount.toFixed(2)} (৳${(amount * config.dollarRateInBDT).toFixed(0)}) ডিপোজিট সফল`
    };

    setCurrentUser(prev => ({
      ...prev,
      employerBalance: Number((prev.employerBalance + amount).toFixed(2))
    }));

    setTransactions(prev => [newTx, ...prev]);

    return {
      success: true,
      message: `আপনার $${amount.toFixed(2)} (৳${(amount * config.dollarRateInBDT).toFixed(0)}) ডিপোজিট সফলভাবে অ্যাকাউন্টে যোগ করা হয়েছে!`
    };
  };

  // Claim referral earnings
  const claimReferralEarnings = () => {
    if (currentUser.referralEarnings <= 0) {
      return { success: false, message: 'দাবি করার মতো কোনো রেফারেল বোনাস নেই।' };
    }

    const bonus = currentUser.referralEarnings;
    setCurrentUser(prev => ({
      ...prev,
      workerBalance: Number((prev.workerBalance + bonus).toFixed(2)),
      referralEarnings: 0
    }));

    const bonusTx: WalletTransaction = {
      id: `tx_ref_${Date.now()}`,
      userId: currentUser.id,
      userName: currentUser.name,
      type: 'referral_bonus',
      amount: bonus,
      status: 'completed',
      date: new Date().toISOString().replace('T', ' ').slice(0, 16),
      note: `রেফারেল বোনাস আর্নিং ওয়ালেটে যোগ হয়েছে ($${bonus.toFixed(2)})`
    };

    setTransactions(prev => [bonusTx, ...prev]);
    return { success: true, message: `অভিনন্দন! $${bonus.toFixed(2)} রেফারেল বোনাস সরাসরি আপনার মূল আর্নিং ব্যালেন্সে যোগ হয়েছে।` };
  };

  // Simulate a new friend joining via referral
  const simulateNewReferral = (friendName: string) => {
    const name = friendName.trim() || 'নতুন বন্ধু';
    const bonusEarned = 0.25;

    const newRef = {
      id: `ref_${Date.now()}`,
      name,
      avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${encodeURIComponent(name)}`,
      joinedAt: new Date().toISOString().slice(0, 10),
      tasksCompleted: 1,
      commissionGenerated: bonusEarned
    };

    setCurrentUser(prev => ({
      ...prev,
      referralEarnings: Number((prev.referralEarnings + bonusEarned).toFixed(2)),
      referredUsers: [newRef, ...prev.referredUsers]
    }));
  };

  const resetDemoData = () => {
    setCurrentUser(INITIAL_USER);
    setJobs(INITIAL_JOBS);
    setSubmissions(INITIAL_SUBMISSIONS);
    setTransactions(INITIAL_TRANSACTIONS);
    localStorage.clear();
  };

  return (
    <AppContext.Provider
      value={{
        currentUser,
        jobs,
        submissions,
        transactions,
        config,
        activeTab,
        setActiveTab,
        submitTask,
        createJob,
        toggleJobStatus,
        reviewSubmission,
        requestWithdrawal,
        requestDeposit,
        claimReferralEarnings,
        simulateNewReferral,
        resetDemoData
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};
