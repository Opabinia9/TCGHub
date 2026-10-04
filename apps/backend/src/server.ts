import buildServer from './app.js';
import { ENV } from './env.js';

const server = buildServer({
  logger: {
    transport: {
      target: 'pino-pretty',
    },
  },
});

server.listen({ port: ENV.PORT }, (err, address) => {
  if (err) {
    console.error(err);
    process.exit(1);
  }
  console.log(`Server listening at ${address}`);
});
