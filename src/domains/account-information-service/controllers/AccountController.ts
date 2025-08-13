import { Request, Response } from 'express';
import { controller, httpGet, request, response, queryParam } from 'inversify-express-utils';
import { inject } from 'inversify';
import { IAccountInfoService } from '../interfaces/IAccountInfoService';
import { TYPES } from '../models/types';
import 'reflect-metadata';

@controller('/accounts')
export class AccountController {
  constructor(
    @inject(TYPES.AccountInfoService) private accountInfoService: IAccountInfoService
  ) {}

  @httpGet('/')
  public async getAccounts(
    @queryParam('bank') bankIdentifier: string,
    @request() req: Request,
    @response() res: Response
  ) {
    if (!bankIdentifier) {
      return res.status(400).send({ error: 'Bank identifier is required.' });
    }

    try {
      // In a real app, credentials would come from the user's session or token
      const credentials = { apiKey: 'mock-api-key' };
      const accounts = await this.accountInfoService.fetchAccounts(bankIdentifier, credentials);
      return res.status(200).json(accounts);
    } catch (error: any) {
      return res.status(500).send({ error: error.message });
    }
  }
}