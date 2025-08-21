// Import necessary modules
import { Container } from 'inversify';
import { TYPES } from './common/types';
import { IAccountInfoService } from './domains/account-information/interfaces/IAccountInfoService';
import { AccountInfoService } from './domains/account-information/services/AccountInfoService';
// import { IAccountInfoProvider } from './providers/interfaces/IAccountInfoAdaptor';
import { IProviderPlugin } from './providers/interfaces/IProviderPlugin';
import { AccountController } from './domains/account-information/controllers/AccountController';
import * as fs from 'fs';
import * as path from 'path';
import 'reflect-metadata';

// Helper: recursively collect all .js plugin files
function getPluginFiles(dir: string): string[] {
  const entries = fs.readdirSync(dir, { withFileTypes: true });
  let files: string[] = [];

  for (const entry of entries) {
    const fullPath = path.join(dir, entry.name);

    if (entry.isDirectory()) {
      files = files.concat(getPluginFiles(fullPath)); // recurse into subdir
    } else if (
      entry.isFile() &&
      entry.name.startsWith('index') &&
      entry.name.endsWith('.js') &&
      !entry.name.endsWith('.d.ts') &&
      !entry.name.endsWith('.js.map')
    ) {
      files.push(fullPath);
    }
  }
  return files;
}

export async function configureContainer(): Promise<Container> {
  const container = new Container();

  // Core bindings
  container.bind<IAccountInfoService>(TYPES.AccountInfoService).to(AccountInfoService).inSingletonScope();
  container.bind<AccountController>(AccountController).toSelf();

  // Dynamically load plugins
  const pluginsDir = path.join(__dirname, './providers/plugins'); // compiled dir
  console.log(`Looking for plugins under: ${pluginsDir}`);

  try {
    const pluginFiles = getPluginFiles(pluginsDir);

    for (const pluginPath of pluginFiles) {
      console.log(`Attempting to import plugin: ${pluginPath}`);
      try {
        const pluginModule = await import(pluginPath);

        for (const exportName in pluginModule) {
          const PluginClass = pluginModule[exportName];
          if (typeof PluginClass === 'function' && PluginClass.prototype) {
            // Bind plugin class to IProviderPlugin
            // container.bind<IAccountInfoProvider>(TYPES.IAccountInfoProvider).to(PluginClass).inSingletonScope();
            container.bind<IProviderPlugin>(TYPES.IProviderPlugin).to(PluginClass).inSingletonScope();
            console.log(`Bound plugin: ${exportName} from ${path.basename(pluginPath)}`);
            break; // assume one plugin per file
          }
        }
      } catch (importError) {
        console.error(`❌ Failed to import plugin ${pluginPath}:`, importError);
      }
    }
  } catch (err) {
    console.error(`❌ Failed to read plugins directory ${pluginsDir}:`, err);
  }

  return container;
}
