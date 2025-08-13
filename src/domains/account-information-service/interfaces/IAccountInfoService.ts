export interface IAccountInfoService {
  fetchAccounts(bankIdentifier: string, credentials: any): Promise<any[]>;
  fetchTransactions(bankIdentifier: string, accountId: string, credentials: any): Promise<any[]>;
}