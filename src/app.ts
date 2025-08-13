import "reflect-metadata";
import * as express from 'express';
import { InversifyExpressServer } from 'inversify-express-utils';
import { configureContainer } from './container'; // Import only configureContainer

async function startApp() {
  const container = await configureContainer(); // Get the configured container

  // Start the server with the configured container
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
}

startApp().catch(error => {
  console.error("Error starting application:", error);
});
