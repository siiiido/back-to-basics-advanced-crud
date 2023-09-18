import express from 'express'
import mongoose from 'mongoose'
import dotenv from 'dotenv'
import bodyParser from 'body-parser'
import { Request, Response, NextFunction } from 'express'

dotenv.config()
const { MONGO_DB_URL } = process.env
const app = express()

app.use(bodyParser.json())

app.use((req: Request, res: Response, next: NextFunction) => {
  const error = res.status(404).json({ message: 'Could not find this route' })
  throw error
})

mongoose.Promise = Promise
mongoose.connect(MONGO_DB_URL as string).then(() => app.listen(5050))
mongoose.connection.on('error', (error: Error) => console.log(error))
