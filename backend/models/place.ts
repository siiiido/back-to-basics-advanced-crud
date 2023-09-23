import mongoose from 'mongoose'

interface IPlace {
  title: string
  description: string
  image: string
  address: string
  location: {
    lat: number
    lng: number
  }
  creator: mongoose.Types.ObjectId
}

const placeSchema = new mongoose.Schema<IPlace>({
  title: { type: String, required: true },
  description: { type: String, required: true },
  image: { type: String, required: true },
  address: { type: String, required: true },
  location: {
    lat: { type: Number, require: true },
    lng: { type: Number, required: true },
  },
  creator: [{ type: mongoose.Types.ObjectId, required: true, ref: 'User' }],
})

const Place = mongoose.model<IPlace>('Place', placeSchema)

export default Place
