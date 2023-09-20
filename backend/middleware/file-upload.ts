import multer, { FileFilterCallback } from 'multer'
import { v4 as uuidv4 } from 'uuid'
import { Request } from 'express'

const MIME_TYPE_MAP: { [key: string]: string } = {
  'image/png': 'png',
  'image/jpeg': 'jpeg',
  'image/jpg': 'jpg',
}

const fileUpload = multer({
  limits: 500000,
  storage: multer.diskStorage({
    destination: (
      req: Request,
      file: Express.Multer.File,
      cb: (error: Error | null, destination: string) => void,
    ) => {
      cb(null, 'uploads/images')
    },
    filename: (
      req: Request,
      file: Express.Multer.File,
      cb: (error: Error | null, filename: string) => void,
    ) => {
      const ext = MIME_TYPE_MAP[file.mimetype]
      cb(null, `${uuidv4()}.${ext}`)
    },
  }),
  fileFilter: (
    req: Request,
    file: Express.Multer.File,
    cb: FileFilterCallback,
  ) => {
    const isValid = !!MIME_TYPE_MAP[file.mimetype]
    let error = isValid ? null : new Error('Invalid mime type!')
    cb(error, isValid)
  },
})

export default fileUpload
