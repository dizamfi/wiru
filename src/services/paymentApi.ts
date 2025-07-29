// src/services/paymentApi.ts
import { 
  PaymentTransaction,
  PaymentSummary,
  WithdrawalRequest,
  BankAccount,
  PaymentFilter,
  PaymentListResponse,
  PaymentDetailsResponse,
  WithdrawalResponse,
  PaymentExport,
  BankAccountForm,
  WithdrawalForm
} from '@/types/payment';

// Mock data para desarrollo
const mockTransactions: PaymentTransaction[] = [
  {
    id: 'txn_001',
    orderId: 'ORD-2024-001',
    amount: 245.50,
    currency: 'USD',
    status: 'completed',
    type: 'sale',
    method: 'bank_transfer',
    description: 'Venta de iPhone 12 Pro',
    date: '2024-01-15T10:30:00Z',
    completedAt: '2024-01-16T14:20:00Z',
    reference: 'REF-001-2024',
    bankAccount: {
        name: 'Juan Pérez',
        bank: 'Banco Nacional',
        account: '****-4532',
        accountType: 'checking'
    },
    metadata: {
      deviceType: 'smartphone',
      weight: 0.2
    }
  },
  {
    id: 'txn_002',
    orderId: 'ORD-2024-002',
    amount: 120.00,
    currency: 'USD',
    status: 'processing',
    type: 'sale',
    method: 'bank_transfer',
    description: 'Venta de laptop Dell',
    date: '2024-01-14T09:15:00Z',
    bankAccount: {
        name: 'Juan Pérez',
        bank: 'Banco Nacional',
        account: '****-4532',
        accountType: 'checking'
    },
    metadata: {
      deviceType: 'laptop',
      weight: 2.1
    }
  },
  {
    id: 'txn_003',
    orderId: 'REF-2024-001',
    amount: 25.00,
    currency: 'USD',
    status: 'completed',
    type: 'referral',
    method: 'bank_transfer',
    description: 'Bono por referido - María González',
    date: '2024-01-13T16:45:00Z',
    completedAt: '2024-01-14T10:30:00Z',
    metadata: {
      referralCode: 'REF-MG-001'
    }
  },
  {
    id: 'txn_004',
    orderId: 'ORD-2024-003',
    amount: 89.75,
    currency: 'USD',
    status: 'pending',
    type: 'sale',
    method: 'bank_transfer',
    description: 'Venta de tablet Samsung',
    date: '2024-01-12T14:20:00Z',
    metadata: {
      deviceType: 'tablet',
      weight: 0.5
    }
  },
  {
    id: 'txn_005',
    orderId: 'ORD-2024-004',
    amount: 156.30,
    currency: 'USD',
    status: 'failed',
    type: 'sale',
    method: 'bank_transfer',
    description: 'Venta de consola PlayStation',
    date: '2024-01-11T11:10:00Z',
    metadata: {
      deviceType: 'gaming',
      weight: 3.2
    }
  }
];

const mockSummary: PaymentSummary = {
  totalEarnings: 1247.85,
  pendingAmount: 209.75,
  completedThisMonth: 390.50,
  completedThisYear: 1247.85,
  totalTransactions: 23,
  availableForWithdrawal: 845.60,
  currency: 'USD'
};

const mockBankAccounts: BankAccount[] = [
  {
    id: 'ba_001',
    name: 'Juan Pérez',
    bank: 'Banco Nacional',
    account: '****-4532',
    accountType: 'checking',
    isDefault: true,
    verified: true
  }
];

// Simulador de delay de red
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

class PaymentApiService {
  private baseUrl = '/payments';

  // Transactions
  async getTransactions(params: PaymentFilter & { page?: number; limit?: number }): Promise<PaymentListResponse> {
    await delay(500); // Simular delay de red
    
    let filtered = [...mockTransactions];
    
    // Aplicar filtros
    if (params.status && params.status !== 'all') {
      filtered = filtered.filter(t => t.status === params.status);
    }
    
    if (params.type && params.type !== 'all') {
      filtered = filtered.filter(t => t.type === params.type);
    }
    
    if (params.searchTerm) {
      const term = params.searchTerm.toLowerCase();
      filtered = filtered.filter(t => 
        t.description.toLowerCase().includes(term) ||
        t.orderId.toLowerCase().includes(term)
      );
    }
    
    return {
      transactions: filtered,
      total: filtered.length,
      page: params.page || 1,
      limit: params.limit || 20,
      hasMore: false
    };
  }

  async getTransactionById(id: string): Promise<PaymentTransaction> {
    await delay(300);
    const transaction = mockTransactions.find(t => t.id === id);
    if (!transaction) throw new Error('Transaction not found');
    return transaction;
  }

  async getTransactionDetails(id: string): Promise<PaymentDetailsResponse> {
    await delay(300);
    const transaction = await this.getTransactionById(id);
    return {
      transaction,
      relatedTransactions: [],
      downloadUrls: {
        receipt: '/api/transactions/' + id + '/receipt.pdf',
        invoice: '/api/transactions/' + id + '/invoice.pdf'
      }
    };
  }

  // Summary
  async getPaymentSummary(): Promise<PaymentSummary> {
    await delay(400);
    return mockSummary;
  }

  async getPaymentAnalytics(period: 'week' | 'month' | 'quarter' | 'year' = 'month') {
    await delay(600);
    return {
      period,
      data: [
        { date: '2024-01-01', earnings: 245.50, transactions: 1 },
        { date: '2024-01-02', earnings: 120.00, transactions: 1 },
        { date: '2024-01-03', earnings: 89.75, transactions: 1 }
      ]
    };
  }

  // Withdrawals
  async createWithdrawal(request: WithdrawalForm): Promise<WithdrawalResponse> {
    await delay(800);
    
    const withdrawal: WithdrawalRequest = {
      id: 'wd_' + Date.now(),
      userId: 'user_123',
      amount: request.amount,
      currency: 'USD',
      method: request.method,
      status: 'pending',
      requestedAt: new Date().toISOString(),
      fees: {
        processingFee: 0,
        platformFee: 3.50,
        withdrawalFee: 0,
        totalFees: 3.50,
        currency: 'USD'
      },
      bankAccountId: request.bankAccountId,
      paypalEmail: request.paypalEmail,
      cryptoAddress: request.cryptoAddress,
      cryptoCurrency: request.cryptoCurrency
    };
    
    return {
      withdrawal,
      estimatedCompletionDate: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000).toISOString(),
      message: 'Tu solicitud de retiro ha sido procesada correctamente'
    };
  }

  async getWithdrawals(): Promise<WithdrawalRequest[]> {
    await delay(400);
    return []; // Mock empty array for now
  }

  async getWithdrawalById(id: string): Promise<WithdrawalRequest> {
    await delay(300);
    throw new Error('Withdrawal not found');
  }

  async cancelWithdrawal(id: string): Promise<void> {
    await delay(500);
    // Mock success
  }

  async getWithdrawalLimits() {
    await delay(200);
    return {
      minAmount: 10,
      maxAmount: 10000,
      dailyLimit: 5000,
      weeklyLimit: 20000,
      monthlyLimit: 50000
    };
  }

  // Bank Accounts
  async getBankAccounts(): Promise<BankAccount[]> {
    await delay(300);
    return mockBankAccounts;
  }

  async addBankAccount(account: BankAccountForm): Promise<BankAccount> {
    await delay(600);
    const newAccount: BankAccount = {
      id: 'ba_' + Date.now(),
      ...account,
      verified: false
    };
    mockBankAccounts.push(newAccount);
    return newAccount;
  }

  async updateBankAccount(id: string, account: Partial<BankAccountForm>): Promise<BankAccount> {
    await delay(500);
    const index = mockBankAccounts.findIndex(acc => acc.id === id);
    if (index === -1) throw new Error('Bank account not found');
    
    mockBankAccounts[index] = { ...mockBankAccounts[index], ...account };
    return mockBankAccounts[index];
  }

  async deleteBankAccount(id: string): Promise<void> {
    await delay(400);
    const index = mockBankAccounts.findIndex(acc => acc.id === id);
    if (index !== -1) {
      mockBankAccounts.splice(index, 1);
    }
  }

  async setDefaultBankAccount(id: string): Promise<void> {
    await delay(300);
    mockBankAccounts.forEach(acc => {
      acc.isDefault = acc.id === id;
    });
  }

  async verifyBankAccount(id: string, microDeposits: number[]): Promise<void> {
    await delay(1000);
    const account = mockBankAccounts.find(acc => acc.id === id);
    if (account) {
      account.verified = true;
    }
  }

  // Export
  async exportTransactions(options: PaymentExport): Promise<string> {
    await delay(2000); // Simular tiempo de procesamiento
    
    // En desarrollo, retornar una URL mock
    const mockData = 'data:text/csv;charset=utf-8,ID,Fecha,Descripción,Monto\ntxn_001,2024-01-15,Venta iPhone,245.50';
    return mockData;
  }

  // Receipts & Invoices
  async downloadReceipt(transactionId: string): Promise<string> {
    await delay(1000);
    return 'data:application/pdf;base64,mock-pdf-data';
  }

  async downloadInvoice(transactionId: string): Promise<string> {
    await delay(1000);
    return 'data:application/pdf;base64,mock-invoice-data';
  }

  // Payment Methods
  async getAvailablePaymentMethods() {
    await delay(200);
    return {
      methods: [
        { id: 'bank_transfer', name: 'Transferencia Bancaria', enabled: true },
        { id: 'paypal', name: 'PayPal', enabled: true },
        { id: 'crypto', name: 'Criptomonedas', enabled: true }
      ]
    };
  }

  async getPaymentMethodFees() {
    await delay(200);
    return {
      bank_transfer: { percentage: 0, fixed: 3.50 },
      paypal: { percentage: 2.9, fixed: 0.30 },
      crypto: { percentage: 1.5, fixed: 0 }
    };
  }

  // Tax Information
  async getTaxDocuments(year: number) {
    await delay(1000);
    return {
      year,
      documents: [],
      totalEarnings: mockSummary.totalEarnings
    };
  }

  async generateTaxSummary(year: number) {
    await delay(1500);
    return {
      year,
      summary: {
        totalEarnings: mockSummary.totalEarnings,
        totalTransactions: mockSummary.totalTransactions,
        taxableAmount: mockSummary.totalEarnings
      }
    };
  }

  // Notifications
  async getPaymentNotifications() {
    await delay(300);
    return {
      notifications: []
    };
  }

  async markNotificationAsRead(notificationId: string): Promise<void> {
    await delay(200);
    // Mock success
  }

  // Disputes
  async createDispute(transactionId: string, reason: string, description: string) {
    await delay(800);
    return {
      disputeId: 'disp_' + Date.now(),
      status: 'submitted',
      message: 'Tu disputa ha sido enviada y será revisada en 24-48 horas'
    };
  }

  async getDisputes() {
    await delay(400);
    return {
      disputes: []
    };
  }

  // Webhooks (for real-time updates)
  async setupWebhookEndpoint(url: string, events: string[]) {
    await delay(500);
    return {
      webhookId: 'wh_' + Date.now(),
      url,
      events,
      secret: 'wh_secret_' + Date.now()
    };
  }
}

export const paymentApi = new PaymentApiService();