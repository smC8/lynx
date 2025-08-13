// import { injectable, multiInject } from 'inversify';
// import { IAccountInfoService } from '../interfaces/IAccountInfoService';
// import { IBankPlugin } from '../interfaces/IBankPlugin';
// import { TYPES } from '../models/types';
// import 'reflect-metadata';
// import * as fs from 'fs';
// import * as path from 'path';

// @injectable()
// export class AccountInfoService implements IAccountInfoService {
//   private readonly plugins: Map<string, IBankPlugin>;

//   constructor(@multiInject(TYPES.IBankPlugin) plugins: IBankPlugin[]) {
//     this.plugins = new Map<string, IBankPlugin>();
//     // Map each plugin instance to a string identifier.
//     this.registerPlugins(plugins);
//   }

//   private async registerPlugins(plugins: IBankPlugin[]): Promise<void> {
//     const pluginsDir = path.join(__dirname, '../plugins');
//     const files = fs.readdirSync(pluginsDir);

//     for (const file of files) {
//       if (file.endsWith('.ts') && !file.startsWith('index.') && file !== 'IBankPlugin.ts') {
//         const pluginPath = path.join(pluginsDir, file);
//         const module = await import(pluginPath);
//         const pluginName = file.replace('.ts', '');
//         const PluginClass = module[pluginName];

//         if (PluginClass) {
//           const pluginInstance = plugins.find(p => p instanceof PluginClass);
//           if (pluginInstance) {
//             this.plugins.set(pluginName.replace('Plugin', ''), pluginInstance);
//           }
//         }
//       }
//     }
//   }

//   private getPlugin(bankIdentifier: string): IBankPlugin {
//     const plugin = this.plugins.get(bankIdentifier);
//     if (!plugin) {
//       throw new Error(`Plugin for bank '${bankIdentifier}' not found.`);
//     }
//     return plugin;
//   }

//   public async fetchAccounts(bankIdentifier: string, credentials: any): Promise<any[]> {
//     const plugin = this.getPlugin(bankIdentifier);
//     return plugin.getAccounts(credentials);
//   }

//   public async fetchTransactions(bankIdentifier: string, accountId: string, credentials: any): Promise<any[]> {
//     const plugin = this.getPlugin(bankIdentifier);
//     return plugin.getTransactions(accountId, credentials);
//   }
// }

// src/domains/account-information/services/AccountInfoService.ts

import { injectable, multiInject } from 'inversify';
import { TYPES } from '../models/types';
import { IAccountInfoService } from '../interfaces/IAccountInfoService';
import { IBankPlugin } from '../interfaces/IBankPlugin';
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
