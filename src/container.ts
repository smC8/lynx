import { Container } from 'inversify';
import { TYPES } from './domains/account-information-service/models/types';
import { IAccountInfoService } from './domains/account-information-service/interfaces/IAccountInfoService';
import { IBankPlugin } from './domains/account-information-service/interfaces/IBankPlugin';
import { AccountInfoService } from './domains/account-information-service/services/AccountInfoService';
import { BoaPlugin } from './domains/account-information-service/plugins/BoaPlugin';
import { ChasePlugin } from './domains/account-information-service/plugins/ChasePlugin';
import { AccountController } from './domains/account-information-service/controllers/AccountController';
import 'reflect-metadata';

const container = new Container();

// Bind the core service as a singleton
container.bind<IAccountInfoService>(TYPES.AccountInfoService).to(AccountInfoService).inSingletonScope();

// Bind each bank plugin to the IBankPlugin interface
container.bind<IBankPlugin>(TYPES.IBankPlugin).to(BoaPlugin);
container.bind<IBankPlugin>(TYPES.IBankPlugin).to(ChasePlugin);

// Bind the controller
container.bind<AccountController>(TYPES.AccountController).to(AccountController);

export { container };