import 'reflect-metadata';
import * as express from 'express';
import { InversifyExpressServer } from 'inversify-express-utils';
import { container } from './container';

// Start the server
const server = new InversifyExpressServer(container);

server.setConfig((app) => {
  // Set up standard Express middleware
  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));
});

const app = server.build();
const port = 3000;

app.listen(port, () => {
  console.log(`Server is running at http://localhost:${port}`);
  console.log('API routes are automatically registered from controllers.');
});