import express from 'express'
import { check } from 'express-validator'

import { getUsers, login, signup } from '../controllers/users-controllers'
import fileUpload from '../middleware/file-upload'

const router = express.Router()

router.get('/', getUsers)

router.post(
  '/signup',
  fileUpload.single('image'),
  [
    check('name').not().isEmpty(),
    check('email').normalizeEmail().isEmail(),
    check('password').isLength({ min: 6 }),
  ],
  signup,
)

router.post('/login', login)
