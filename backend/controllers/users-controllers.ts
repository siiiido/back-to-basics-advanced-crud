/**
 * getUsers
 * signUp
 * login
 */

import { Request, Response, NextFunction } from 'express'
import User from '../models/user'

const getUsers = async (req: Request, res: Response, next: NextFunction) => {
  let users

  try {
    users = await User.find({}, '-password')
  } catch (error) {
    const err = res
      .status(500)
      .json({ message: 'Fetching users failed, please try again later' })

    return next(err)
  }

  res.json({ users: users.map(user => user.toObject({ getters: true })) })
}
