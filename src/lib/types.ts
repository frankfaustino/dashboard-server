import { GraphQLResolveInfo } from 'graphql'
// import { Mutation as ApiMutation, Query as ApiQuery } from './generated/api'
// import { Prisma } from './generated/prisma'
// import * as Types from './types; // you can omit this
// export type FirstArgument<T> = T extends (arg1: infer U, ...args: any[]) => any ? U : any

// export type Remapped<T> = {
//   [P in keyof T]: (
//   parent: null | undefined,
//   args: FirstArgument<T[P]>,
//   ctx: Context,
//   info?: GraphQLResolveInfo
//   ) => any
// }

export interface Context {
  // db: MariaDB
  req: any
  res: any
  username?: string
  sessionId?: string
}

// export type Query = Partial<Remapped<ApiQuery>>

// export type Mutation = Partial<Remapped<ApiMutation>>

export type Resolver = (parent: null | undefined, args: any, ctx: Context, info: GraphQLResolveInfo) => any

export type AnswerHubResponse = {
  type: string
  verb?: string
  count?: number
}

export type DecodedToken = {
  iat: string
  sessionId: string
  username: string
}