import { injectable, multiInject } from 'inversify';
import { TYPES } from '../../../common/types';
import { IAccountInfoService } from '../interfaces/IAccountInfoService';
// import { IBankPlugin } from '../../../providers/interfaces/IAccountInfoAdaptor';
import { IProviderPlugin } from '../../../providers/interfaces/IProviderPlugin';
import 'reflect-metadata';

@injectable()
export class AccountInfoService implements IAccountInfoService {
  // private bankPlugins: IBankPlugin[];
  private bankPlugins: IProviderPlugin[];

  // constructor(@multiInject(TYPES.IBankPlugin) bankPlugins: IBankPlugin[]) {
    constructor(@multiInject(TYPES.IProviderPlugin) bankPlugins: IProviderPlugin[]) {
      this.bankPlugins = bankPlugins;
  }

  public async fetchAccounts(bankIdentifier: string, credentials: any): Promise<any[]> {
    console.log(`Plugins available : ${this.bankPlugins}`);
    console.log(`Fetching accounts for bank identifier: ${bankIdentifier}`);
    const plugin = this.bankPlugins.find(p => p.accountInfo?.getBankName() === bankIdentifier);

    if (!plugin) {
      const availablePlugins = this.bankPlugins.map(p => p.accountInfo?.getBankName()).join(', ');
      throw new Error(`Plugin for bank '${bankIdentifier}' not found. Available plugins: ${availablePlugins}`);
    }

    return plugin.accountInfo?.getAccounts(credentials);
  }

  public async fetchTransactions(bankIdentifier: string, accountId: string, credentials: any): Promise<any[]> {
    console.log(`Fetching transactions for bank identifier: ${bankIdentifier}, account: ${accountId}`);
    const plugin = this.bankPlugins.find(p => p.accountInfo.getBankName() === bankIdentifier);

    if (!plugin) {
       const availablePlugins = this.bankPlugins.map(p => p.accountInfo.getBankName()).join(', ');
      throw new Error(`Plugin for bank '${bankIdentifier}' not found. Available plugins: ${availablePlugins}`);
    }

    return plugin.accountInfo.getTransactions(accountId, credentials);
  }

  // Potentially other methods here
}
