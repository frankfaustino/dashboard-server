import { Request, Response } from 'express'


/**
 * GET /api/
 * Hello, World! 👋
 */
export const welcome = (req: Request, res: Response) => {
  const { name } = req.params
  name ? res.send(`Hello, ${name}!`) : res.send('Hello, World!')
}