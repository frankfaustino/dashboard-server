require('dotenv').config({ path: './.env' })
import { ApolloServer, ServerInfo } from 'apollo-server'
import jwt from 'jsonwebtoken'

import schema from './modules'
import { DecodedToken } from './lib'

const { CLIENT, JWT_SECRET, PORT } = process.env

const cors = {
  credentials: true,
  origin: [CLIENT || 'http://localhost:3000'],
}

const context = ({ req, res }) => {
  console.log('🔥 Request header: ', req.headers)
  const { cookie } = req.headers
  const returnVal = { req, res }
  if (cookie) {
    const decoded = jwt.verify(cookie.split('=')[1], JWT_SECRET!)
    const { username, sessionId } = decoded as DecodedToken
    Object.assign(returnVal, { username, sessionId })
  }
  return returnVal
}

const server = new ApolloServer({
  context,
  cors,
  schema,
})

server
  .listen({ port: PORT || 4000 })
  .then(({ url }: ServerInfo) => console.log(`🤖 Server ready at ${url}`))
