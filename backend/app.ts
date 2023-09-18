import express from 'express'
import mongoose from 'mongoose'
import dotenv from 'dotenv'
dotenv.config()

const { MONGO_DB_URL } = process.env

const app = express()

mongoose.Promise = Promise
mongoose.connect(MONGO_DB_URL as string).then(() => app.listen(5050))
mongoose.connection.on('error', (error: Error) => console.log(error))
