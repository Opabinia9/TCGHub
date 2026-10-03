import buildServer from './app.js';

const server = buildServer({
  logger: {
    transport: {
      target: 'pino-pretty',
    },
  },
});

server.listen({ port: 8080 }, (err, address) => {
  if (err) {
    console.error(err);
    process.exit(1);
  }
  console.log(`Server listening at ${address}`);
});
