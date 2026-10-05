import buildServer from './app.js';
import { ENV } from './utils/env.js';

const server = buildServer({
  logger: {
    transport: {
      target: 'pino-pretty',
    },
  },
});

server.listen({ port: ENV.SERVER_PORT }, (err, address) => {
  if (err) {
    console.error(err);
    process.exit(1);
  }
  console.log(`Server listening at ${address}`);
});
