import Fastify from 'fastify'
import authRoutes from './routes/api/v1/auth.js'

const server: Fastify.FastifyInstance = Fastify(
  { logger: {
  transport: {
    target: 'pino-pretty'
  },
} }
)

server.register(authRoutes, { prefix: '/api/v1/auth'});

server.listen({ port: 8080 }, (err, address) => {
  if (err) {
    console.error(err)
    process.exit(1)
  }
  console.log(`Server listening at ${address}`)
})
