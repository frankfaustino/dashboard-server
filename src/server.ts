import * as dotenv from 'dotenv'
dotenv.config({ path: './.env' })
import { ApolloServer, ServerInfo } from 'apollo-server'

import schema from './modules'

const server = new ApolloServer({
  context: ({ req, res }) => {
    // TO-DO: Add mariadb to ctx
    console.log('🔥 Request header: ', req.headers)
    return { req, res }
  },
  cors: {
    origin: ['http://localhost:3000', 'http://localhost:4000'],
    credentials: true
  },
  schema
})

server
  .listen({ port: process.env.PORT || 4000 })
  .then(({ url }: ServerInfo) => console.log(`🤖 Server ready at ${url}`))
