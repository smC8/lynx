export interface IBankPlugin {
  getAccounts(credentials: any): Promise<any[]>;
  getTransactions(accountId: string, credentials: any): Promise<any[]>;
  getBankName(): string; // Add this line
}
