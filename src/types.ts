export type UserRole = 'worker' | 'employer';

export type JobCategory = 
  | 'YouTube'
  | 'Facebook & Social'
  | 'Sign Up & Referral'
  | 'Mobile App Install'
  | 'SEO & Web Visit'
  | 'Survey & Quiz'
  | 'Review & Rating'
  | 'Telegram / Discord';

export type TargetRegion = 'International' | 'Asia' | 'Bangladesh' | 'USA/Europe';

export type JobStatus = 'active' | 'paused' | 'completed';

export interface ProofRequirement {
  id: string;
  instruction: string;
  type: 'text' | 'screenshot';
}

export interface Job {
  id: string;
  title: string;
  category: JobCategory;
  employerId: string;
  employerName: string;
  rewardPerWorker: number; // in USD
  totalWorkersNeeded: number;
  completedWorkers: number;
  region: TargetRegion;
  estimatedMinutes: number;
  description: string;
  steps: string[];
  requiredProofs: ProofRequirement[];
  status: JobStatus;
  createdAt: string;
  isFeatured?: boolean;
  autoApproveHours: number;
}

export interface SubmittedProofItem {
  proofId: string;
  instruction: string;
  type: 'text' | 'screenshot';
  value: string; // text answer or base64 / image URL
}

export type SubmissionStatus = 'pending' | 'approved' | 'rejected' | 'revision_requested';

export interface TaskSubmission {
  id: string;
  jobId: string;
  jobTitle: string;
  workerId: string;
  workerName: string;
  employerId: string;
  reward: number;
  proofs: SubmittedProofItem[];
  status: SubmissionStatus;
  rejectionReason?: string;
  revisionNote?: string;
  submittedAt: string;
  reviewedAt?: string;
}

export interface ReferredUser {
  id: string;
  name: string;
  avatar: string;
  joinedAt: string;
  tasksCompleted: number;
  commissionGenerated: number;
}

export interface UserProfile {
  id: string;
  name: string;
  email: string;
  avatar: string;
  workerBalance: number; // approved withdrawable earnings
  pendingBalance: number; // pending review earnings
  employerBalance: number; // deposit balance for jobs
  successRate: number; // e.g. 97%
  completedTasksCount: number;
  joinedAt: string;
  phone?: string;
  referralCode: string;
  referralEarnings: number;
  referredUsers: ReferredUser[];
}

export type TransactionType = 'deposit' | 'withdrawal' | 'job_escrow' | 'task_earning' | 'referral_bonus';
export type PaymentMethod = 'bKash' | 'Nagad' | 'Rocket' | 'Binance USDT' | 'Bank Transfer';

export interface WalletTransaction {
  id: string;
  userId: string;
  userName: string;
  type: TransactionType;
  amount: number;
  fee?: number;
  netAmount?: number;
  method?: PaymentMethod;
  accountDetails?: string;
  txId?: string;
  status: 'pending' | 'completed' | 'rejected';
  date: string;
  note?: string;
}

export interface PlatformConfig {
  platformFeePercent: number; // 10% job post fee
  withdrawalFeePercent: number; // 5% cashout/withdrawal website fee
  minWithdrawalUSD: number; // $1.50
  autoApproveHours: number; // 48 hours
  dollarRateInBDT: number; // 122 BDT
  referralCommissionPercent: number; // 5%
  announcement: string;
}

export type NavTab = 
  | 'browse_jobs'
  | 'post_job'
  | 'add_money'
  | 'my_tasks'
  | 'manage_jobs'
  | 'wallet'
  | 'deposit'
  | 'referrals';
