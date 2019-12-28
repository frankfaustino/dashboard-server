// import * as dotenv from 'dotenv'
// import * as cors from 'cors'
// import * as express from 'express'
import { ApolloServer, gql } from 'apollo-server'

// dotenv.config({ path: './.env' })

// import { handleError } from './lib/utils'


// const { PORT } = process.env
// const app: express.Application = express()

// app
//   .use(cors())
//   .use('/api', require('./api'))
//   .use(handleError)
//   .listen(PORT, () => console.log(`🤖 Server is listening on port ${PORT} in ${app.get('env')} mode`))

const typeDefs = gql`
  type Book {
    title: String
    author: String
  }

  type Query {
    books: [Book]
  }
`

const books = [
  {
    title: 'Harry Potter',
    author: 'J.K. Rowling'
  },
  {
    title: 'Jurassic Park',
    author: 'Michael Crichton'
  }
]

const resolvers = {
  Query: {
    books: () => books
  }
}

const server = new ApolloServer({ typeDefs, resolvers })

server.listen().then(({ url }) => console.log(`🤖 Server ready at ${url}`))