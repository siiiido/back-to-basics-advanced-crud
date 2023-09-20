/**
 * getUsers
 * signUp
 * login
 */

import { Request, Response, NextFunction } from 'express'
import { validationResult } from 'express-validator'
import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'
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

const signup = async (req: Request, res: Response, next: NextFunction) => {
  const errors = validationResult(req)
  if (!errors.isEmpty()) {
    const err = res
      .status(422)
      .json({ message: 'Invalid inputs passed, please check your data.' })

    return next(err)
  }

  const { name, email, password } = req.body

  let existingUser

  try {
    existingUser = await User.findOne({ email: email })
  } catch (error) {
    const err = res
      .status(500)
      .json({ message: 'Signing up failed, please try again later' })

    return next(err)
  }

  if (existingUser) {
    const err = res
      .status(422)
      .json({ message: 'User exists already, please login instead' })

    return next(err)
  }

  let hashedPassword: string
  try {
    hashedPassword = await bcrypt.hash(password, 12)
  } catch (error) {
    const err = res
      .status(500)
      .json({ message: 'Could not create user, please try again.' })

    return next(err)
  }

  const createdUser = new User({
    name,
    email,
    password: hashedPassword,
    image: req.file.path,
    places: [],
  })

  try {
    await createdUser.save()
  } catch (error) {
    const err = res
      .status(500)
      .json({ message: 'Signing up failed, please try again later.' })

    return next(err)
  }

  let token
  try {
    token = jwt.sign(
      { userId: createdUser.id, email: createdUser.email },
      'supersecret_dont_share', // secret key used to sign the token.
      { expiresIn: '1h' },
    )
  } catch (error) {
    const err = res
      .status(500)
      .json({ message: 'Signing up failed, please try again later.' })

    return next(err)
  }

  res
    .status(201)
    .json({ userId: createdUser.id, email: createdUser.email, token: token })
}

const login = async (req: Request, res: Response, next: NextFunction) => {
  const { email, password } = req.body

  let existingUser
  try {
    existingUser = await User.findOne({ email })
  } catch (error) {
    const err = res
      .status(500)
      .json({ message: 'Logging in failed, please try again later.' })

    return next(err)
  }

  if (!existingUser) {
    const err = res
      .status(403)
      .json({ message: 'Invalid credentials, could not log you in.' })

    return next(err)
  }

  let isValidPassword = false
  try {
    isValidPassword = await bcrypt.compare(password, existingUser.password)
  } catch (error) {
    const err = res.status(500).json({
      message:
        'Could not loh you in, please check your credentials and try again later.',
    })

    return next(err)
  }

  if (!isValidPassword) {
    const err = res
      .status(403)
      .json({ message: 'Invalid credentials, could not log you in.' })

    return next(err)
  }

  let token
  try {
    token = jwt.sign(
      { userId: existingUser.id, email: existingUser.email },
      'supersecret_dont_share',
      { expiresIn: '1h' },
    )
  } catch (error) {
    const err = res
      .status(500)
      .json({ message: 'Logging in failed, please tyr again later.' })

    return next(err)
  }

  res.json({
    userId: existingUser.id,
    email: existingUser.email,
    token: token,
  })
}

export { getUsers, login, signup }
