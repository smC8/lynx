// Import necessary modules
import { Container } from 'inversify';
import { TYPES } from './domains/account-information/models/types';
import { IAccountInfoService } from './domains/account-information/interfaces/IAccountInfoService';
import { AccountInfoService } from './domains/account-information/services/AccountInfoService';
import { IBankPlugin } from './domains/account-information/interfaces/IBankPlugin';
import { AccountController } from './domains/account-information/controllers/AccountController';
import * as fs from 'fs';
import * as path from 'path';
import 'reflect-metadata'; // Make sure this is imported for Inversify to work correctly

export async function configureContainer(): Promise<Container> {
  const container = new Container();

  // Bind the core service as a singleton
  container.bind<IAccountInfoService>(TYPES.AccountInfoService).to(AccountInfoService).inSingletonScope();
  container.bind<AccountController>(AccountController).toSelf(); // Bind the controller

  // Dynamically bind bank plugins
  // Adjust the path to point to the compiled JavaScript files in the dist directory
  const pluginsDir = path.join(__dirname, '../dist/domains/account-information/plugins'); // Assuming dist is one level up from the compiled container.js
  console.log(`Looking for plugins in: ${pluginsDir}`);

  try {
    const files = fs.readdirSync(pluginsDir);

    for (const file of files) {
      // Process only compiled JavaScript files (excluding declaration files and map files)
      if (file.endsWith('.js') && !file.endsWith('.d.ts') && !file.endsWith('.js.map')) {
        const pluginPath = path.join(pluginsDir, file);
        console.log(`Attempting to import plugin: ${pluginPath}`);
        try {
            const pluginModule = await import(pluginPath);

            // Iterate through named exports to find the plugin class
            for (const exportName in pluginModule) {
                const PluginClass = pluginModule[exportName];

                // Check if the export is a function (class) and potentially an Inversify injectable
                // We can refine this check if needed, but start with a basic one
                if (typeof PluginClass === 'function' && PluginClass.prototype) {
                   // Add a more specific check if possible, e.g., if it has methods from IBankPlugin
                   // For now, let's rely on the fact that our plugin files export the plugin class
                   // You might want to add a more robust check here in a real application
                   container.bind<IBankPlugin>(TYPES.IBankPlugin).to(PluginClass);
                   console.log(`Bound plugin: ${exportName} from ${file}`);
                   // Assuming only one plugin class per file, we can break after finding one
                   break;
                }
            }
        } catch (importError) {
            console.error(`Failed to import plugin ${file}:`, importError);
        }
      }
    }
  } catch (readDirError) {
      console.error(`Failed to read plugins directory ${pluginsDir}:`, readDirError);
  }


  return container; // Return the configured container
}
