import axios from 'axios'

import { query } from '../../db/fns'

const me = async (_: any, { sessionId }: any) => {
  // query for user id
  query
  console.log('🏄🏼 sessionId: ', sessionId)
  return {
    id: 0,
    firstName: 'test',
    lastName: 'test',
    username: 'test',
    email: '',
    token: '',
    sessionCount: 1,
  }
}

const login = async (_: any, args: any, { res }: any) => {
  try {
    const { username, password, environment } = args
    const data = { username, password }

    if (username && password) {
      const response = await axios({
        method: 'post',
        url: `https://${environment}/cos/v1/dashboard/internal/login`,
        headers: { 'Preferred-Auth': 'internal' },
        data,
        withCredentials: true,
      })

      if (response.status === 200 && response.headers['set-cookie']) {
        const cookies = response.headers['set-cookie'][0]
        const [internalSessionId] = cookies.split(';')
        const sessionId = internalSessionId.substring(16, internalSessionId.length)
        res.cookie('sessionId', sessionId, { maxAge: 3600000 })
        // need to store user id in cookie too
        return { sessionId, error: null }
      }

      // Check if user exists in DB
      // Store session in DB
      // Increment session count
    }
    return { sessionId: null, error: 'Missing parameters.' }
  } catch (error) {
    console.error('login: ', error)
    if (error.response && error.response.data) {
      return { sessionId: null, error: error.response.data.message }
    }
    return { sessionId: null, error: error.message }
  }
}

export default {
  Query: {
    me
  },
  Mutation: {
    login
  }
}
