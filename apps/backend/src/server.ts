import buildServer from '@/app.js';
import { ENV } from '@/utils/env.js';

const server = await buildServer(
  {
    logger: {
      transport: {
        target: 'pino-pretty',
      },
    },
  },
  ENV,
);

server.listen({ port: ENV.SERVER_PORT, host: '0.0.0.0' }, (err, address) => {
  if (err) {
    console.error(err);
    process.exit(1);
  }
  console.log(`Server listening at ${address}`);
});
