import { injectable } from 'inversify';
import 'reflect-metadata';

import { IProviderPlugin } from "../../interfaces/IProviderPlugin";
import { BoaPaymentAdaptor } from "./paymentAdapter";
import { BoaAccountInfoAdaptor } from "./AccountInfoAdaptor"

@injectable()
export class BoaPlugin implements IProviderPlugin {
  name = "boa";
  payment = new BoaPaymentAdaptor();
  accountInfo = new BoaAccountInfoAdaptor()
};
