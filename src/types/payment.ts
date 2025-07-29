// src/types/payment.ts

export interface PaymentTransaction {
  id: string;
  orderId: string;
  amount: number;
  currency: string;
  status: PaymentStatus;
  type: PaymentType;
  method: PaymentMethod;
  description: string;
  date: string;
  completedAt?: string;
  failedAt?: string;
  reference?: string;
  bankAccount?: BankAccount;
  paypalEmail?: string;
  cryptoAddress?: string;
  metadata?: PaymentMetadata;
  fees?: PaymentFees;
  notes?: string;
}

export type PaymentStatus = 
  | 'pending'
  | 'processing' 
  | 'completed' 
  | 'failed' 
  | 'cancelled'
  | 'refunded'
  | 'disputed';

export type PaymentType = 
  | 'sale'
  | 'referral' 
  | 'bonus' 
  | 'refund'
  | 'withdrawal'
  | 'deposit'
  | 'fee'
  | 'adjustment';

export type PaymentMethod = 
  | 'bank_transfer'
  | 'paypal'
  | 'stripe'
  | 'crypto'
  | 'cash'
  | 'check'
  | 'wire_transfer';

export interface BankAccount {
  id?: string;
  name: string;
  bank: string;
  account: string;
  accountType: 'checking' | 'savings';
  routingNumber?: string;
  swiftCode?: string;
  isDefault?: boolean;
  verified?: boolean;
}

export interface PaymentMetadata {
  deviceType?: string;
  deviceModel?: string;
  weight?: number;
  referralCode?: string;
  referralUserId?: string;
  orderId?: string;
  invoiceId?: string;
  campaignId?: string;
  location?: string;
}

export interface PaymentFees {
  processingFee: number;
  platformFee: number;
  withdrawalFee: number;
  totalFees: number;
  currency: string;
}

export interface PaymentSummary {
  totalEarnings: number;
  pendingAmount: number;
  completedThisMonth: number;
  completedThisYear: number;
  totalTransactions: number;
  availableForWithdrawal: number;
  lastPaymentDate?: string;
  currency: string;
}

export interface WithdrawalRequest {
  id: string;
  userId: string;
  amount: number;
  currency: string;
  method: PaymentMethod;
  bankAccountId?: string;
  paypalEmail?: string;
  cryptoAddress?: string;
  cryptoCurrency?: string;
  status: WithdrawalStatus;
  requestedAt: string;
  processedAt?: string;
  completedAt?: string;
  reference?: string;
  fees: PaymentFees;
  notes?: string;
}

export type WithdrawalStatus = 
  | 'pending'
  | 'approved'
  | 'processing'
  | 'completed'
  | 'rejected'
  | 'cancelled';

export interface PaymentFilter {
  status?: PaymentStatus | 'all';
  type?: PaymentType | 'all';
  method?: PaymentMethod | 'all';
  dateRange?: DateRange;
  amountRange?: AmountRange;
  searchTerm?: string;
}

export interface DateRange {
  from: string;
  to: string;
  preset?: 'today' | 'week' | 'month' | 'quarter' | 'year' | 'custom';
}

export interface AmountRange {
  min: number;
  max: number;
}

export interface PaymentExport {
  format: 'csv' | 'xlsx' | 'pdf';
  dateRange: DateRange;
  filters?: PaymentFilter;
  includeMetadata?: boolean;
}

// API Response types
export interface PaymentListResponse {
  transactions: PaymentTransaction[];
  total: number;
  page: number;
  limit: number;
  hasMore: boolean;
}

export interface PaymentDetailsResponse {
  transaction: PaymentTransaction;
  relatedTransactions?: PaymentTransaction[];
  downloadUrls?: {
    receipt?: string;
    invoice?: string;
  };
}

export interface WithdrawalResponse {
  withdrawal: WithdrawalRequest;
  estimatedCompletionDate?: string;
  message?: string;
}

// Store types
export interface PaymentState {
  transactions: PaymentTransaction[];
  summary: PaymentSummary | null;
  withdrawals: WithdrawalRequest[];
  bankAccounts: BankAccount[];
  loading: boolean;
  error: string | null;
  filters: PaymentFilter;
  pagination: {
    page: number;
    limit: number;
    total: number;
    hasMore: boolean;
  };
}

export interface PaymentActions {
  // Transactions
  fetchTransactions: (filters?: PaymentFilter) => Promise<void>;
  fetchTransactionById: (id: string) => Promise<PaymentTransaction>;
  
  // Summary
  fetchPaymentSummary: () => Promise<void>;
  
  // Withdrawals
  createWithdrawal: (request: Omit<WithdrawalRequest, 'id' | 'userId' | 'requestedAt' | 'status'>) => Promise<WithdrawalResponse>;
  fetchWithdrawals: () => Promise<void>;
  cancelWithdrawal: (id: string) => Promise<void>;
  
  // Bank Accounts
  fetchBankAccounts: () => Promise<void>;
  addBankAccount: (account: Omit<BankAccount, 'id'>) => Promise<BankAccount>;
  updateBankAccount: (id: string, account: Partial<BankAccount>) => Promise<BankAccount>;
  deleteBankAccount: (id: string) => Promise<void>;
  setDefaultBankAccount: (id: string) => Promise<void>;
  
  // Filters & Pagination
  setFilters: (filters: Partial<PaymentFilter>) => void;
  setPage: (page: number) => void;
  resetFilters: () => void;
  
  // Export
  exportTransactions: (options: PaymentExport) => Promise<string>;
  
  // Utility
  clearError: () => void;
  reset: () => void;
}

// Form types
export interface BankAccountForm {
  name: string;
  bank: string;
  account: string;
  accountType: 'checking' | 'savings';
  routingNumber?: string;
  isDefault?: boolean;
}

export interface WithdrawalForm {
  amount: number;
  method: PaymentMethod;
  bankAccountId?: string;
  paypalEmail?: string;
  cryptoAddress?: string;
  cryptoCurrency?: string;
}

// Validation types
export interface PaymentValidation {
  minWithdrawalAmount: number;
  maxWithdrawalAmount: number;
  withdrawalFeePercentage: number;
  withdrawalFeeFixed: number;
  processingDays: {
    bank_transfer: number;
    paypal: number;
    crypto: number;
  };
}

// Notification types
export interface PaymentNotification {
  id: string;
  type: 'payment_received' | 'withdrawal_completed' | 'payment_failed' | 'withdrawal_approved';
  title: string;
  message: string;
  amount?: number;
  currency?: string;
  transactionId?: string;
  createdAt: string;
  read: boolean;
}
