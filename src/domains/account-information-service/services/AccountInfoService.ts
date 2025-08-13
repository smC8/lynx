import { injectable, multiInject } from 'inversify';
import { IAccountInfoService } from '../interfaces/IAccountInfoService';
import { IBankPlugin } from '../interfaces/IBankPlugin';
import { TYPES } from '../models/types';
import { BoaPlugin } from '../plugins/BoaPlugin';
import { ChasePlugin } from '../plugins/ChasePlugin';
import 'reflect-metadata';

@injectable()
export class AccountInfoService implements IAccountInfoService {
  private readonly plugins: Map<string, IBankPlugin>;

  constructor(@multiInject(TYPES.IBankPlugin) plugins: IBankPlugin[]) {
    this.plugins = new Map<string, IBankPlugin>();
    // Map each plugin instance to a string identifier.
    // In a real application, you might use a unique ID property on the plugin.
    for (const plugin of plugins) {
      if (plugin instanceof BoaPlugin) {
        this.plugins.set('BofA', plugin);
      } else if (plugin instanceof ChasePlugin) {
        this.plugins.set('Chase', plugin);
      }
    }
  }

  private getPlugin(bankIdentifier: string): IBankPlugin {
    const plugin = this.plugins.get(bankIdentifier);
    if (!plugin) {
      throw new Error(`Plugin for bank '${bankIdentifier}' not found.`);
    }
    return plugin;
  }

  public async fetchAccounts(bankIdentifier: string, credentials: any): Promise<any[]> {
    const plugin = this.getPlugin(bankIdentifier);
    return plugin.getAccounts(credentials);
  }

  public async fetchTransactions(bankIdentifier: string, accountId: string, credentials: any): Promise<any[]> {
    const plugin = this.getPlugin(bankIdentifier);
    return plugin.getTransactions(accountId, credentials);
  }
}