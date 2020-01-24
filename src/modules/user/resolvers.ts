import axios from 'axios'
import jwt from 'jsonwebtoken'

import { queryUser, query } from '../../db'
import { Resolver } from '../../lib'

// const { NODE_ENV } = process.env

const cookieOptions = {
  httpOnly: true,
  maxAge: 3600000,
  // uncomment these when ready to deploy
  // secure: NODE_ENV === 'production',
  // domain: NODE_ENV === 'production' ? '10.133.32.156' : 'localhost'
}

const me: Resolver = async (_, {}, { username }) => queryUser(username)

const login: Resolver = async (_, args, { res }) => {
  try {
    const { username, password, environment } = args
    const data = { username, password }

    // TO-DO: validate username and password (maybe do validation on the client)
    if (username && password) {
      const response = await axios({
        data,
        headers: { 'Preferred-Auth': 'internal' },
        method: 'post',
        url: `https://${environment}/cos/v1/dashboard/internal/login`,
        withCredentials: true,
      })

      if (response.status === 200 && response.headers['set-cookie']) {
        // get the sessionId from set-cookie header
        const cookies = response.headers['set-cookie'][0]
        const [internalSessionId] = cookies.split(';')
        const sessionId = internalSessionId.substring(16, internalSessionId.length)

        // create a token containing username and sessionId
        const token = jwt.sign({ username, sessionId }, process.env.JWT_SECRET!)
        // store the token as a cookie on the user's browser
        res.cookie('token', token, cookieOptions)

        // base64 encoded username:password for JIRA API
        const buffer = Buffer.from(`${username}:${password}`)
        const base64 = buffer.toString('base64')

        const user = await queryUser(username)
        if (user) {
          // if user exists in DB, we'll update token and session_count
          const { id, sessionCount } = user
          query([`UPDATE user SET token="${base64}", session_count=${sessionCount + 1} WHERE id=${id}`])
        } else {
          // if user doesn't exist in DB, we'll create a new row
          query([`INSERT INTO user (username, token, session_count) VALUES ("${username}", "${base64}", 1)`])
        }
        return { sessionId, error: null }
      }
    }
    return { sessionId: null, error: 'Missing parameters.' }
  } catch (e) {
    console.error('login: ', e)
    const error = e.response && e.response.data ? e.response.data.message : e.message
    return { sessionId: null, error }
  }
}

const logout: Resolver = (_, {}, { res }) => {
  res.clearCookie('token')
  return { message: 'success' }
}

export default {
  Query: {
    me,
  },
  Mutation: {
    login,
    logout
  }
}
