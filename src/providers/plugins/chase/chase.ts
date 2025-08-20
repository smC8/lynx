import { injectable } from 'inversify';
import { IAccountInfoProvider } from '../../interfaces/IAccountInfoAdaptor';
import 'reflect-metadata';

@injectable()
export class ChasePlugin implements IAccountInfoProvider {
  public async getAccounts(credentials: any): Promise<any[]> {
    console.log('Fetching accounts from Chase...');
    // Replace with your actual Chase API call logic
    const mockAccounts = [
      { id: 'chase-789', name: 'Freedom Credit Card', balance: -250.50 },
      { id: 'chase-101', name: 'Investment Account', balance: 15000.00 },
    ];
    return mockAccounts;
  }

  public async getTransactions(accountId: string, credentials: any): Promise<any[]> {
    console.log(`Fetching transactions for account ${accountId} from Chase...`);
    // Replace with your actual Chase API call logic
    const mockTransactions = [
      { id: 'tx-chase-003', amount: 25.00, description: 'Coffee Shop' },
      { id: 'tx-chase-004', amount: -150.00, description: 'Gas Station' },
    ];
    return mockTransactions;
  }

  public getBankName(): string {
    return 'ChasePlugin'; // Add this method
  }
}