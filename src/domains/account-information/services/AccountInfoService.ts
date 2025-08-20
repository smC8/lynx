import { injectable, multiInject } from 'inversify';
import { TYPES } from '../../../common/types';
import { IAccountInfoService } from '../interfaces/IAccountInfoService';
import { IBankPlugin } from '../../../providers/interfaces/IAccountInfoAdaptor';
import 'reflect-metadata';

@injectable()
export class AccountInfoService implements IAccountInfoService {
  private bankPlugins: IBankPlugin[];

  constructor(@multiInject(TYPES.IBankPlugin) bankPlugins: IBankPlugin[]) {
    this.bankPlugins = bankPlugins;
  }

  public async fetchAccounts(bankIdentifier: string, credentials: any): Promise<any[]> {
    console.log(`Fetching accounts for bank identifier: ${bankIdentifier}`);
    const plugin = this.bankPlugins.find(p => p.getBankName() === bankIdentifier);

    if (!plugin) {
      const availablePlugins = this.bankPlugins.map(p => p.getBankName()).join(', ');
      throw new Error(`Plugin for bank '${bankIdentifier}' not found. Available plugins: ${availablePlugins}`);
    }

    return plugin.getAccounts(credentials);
  }

  public async fetchTransactions(bankIdentifier: string, accountId: string, credentials: any): Promise<any[]> {
    console.log(`Fetching transactions for bank identifier: ${bankIdentifier}, account: ${accountId}`);
    const plugin = this.bankPlugins.find(p => p.getBankName() === bankIdentifier);

    if (!plugin) {
       const availablePlugins = this.bankPlugins.map(p => p.getBankName()).join(', ');
      throw new Error(`Plugin for bank '${bankIdentifier}' not found. Available plugins: ${availablePlugins}`);
    }

    return plugin.getTransactions(accountId, credentials);
  }

  // Potentially other methods here
}
