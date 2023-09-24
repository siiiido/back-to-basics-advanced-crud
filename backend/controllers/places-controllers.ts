import { Request, Response, NextFunction } from 'express'
import { validationResult } from 'express-validator'
import mongoose from 'mongoose'
import fs from 'fs'

import getCoordsForAddress from '../utils/location'
import User from '../models/user'
import Place from '../models/place'

const getPlaceById = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  const placeId = req.params.pid

  let place
  try {
    place = await Place.findById(placeId)
  } catch (error) {
    const err = res
      .status(500)
      .json({ message: 'Something went wrong, could not find a place.' })

    return next(err)
  }

  if (!place) {
    const err = res
      .status(404)
      .json({ message: 'Could not find place for the provided id.' })

    return next(err)
  }

  res.json({ place: place.toObject({ getters: true }) })
}

const getPlacesByUserId = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  const userId = req.params.userId

  let userWithPlaces
  try {
    userWithPlaces = await User.findById(userId).populate('places')
  } catch (error) {
    const err = res
      .status(500)
      .json({ message: 'Fetching places failed, please try again later.' })

    return next(err)
  }

  if (!userWithPlaces || userWithPlaces.places.length === 0) {
    const err = res
      .status(404)
      .json({ message: 'Could not find places for the provided user id.' })

    return next(err)
  }

  res.json({
    places: userWithPlaces.places.map(place =>
      place.toObject({ getters: true }),
    ),
  })
}

const createPlace = async (req: Request, res: Response, next: NextFunction) => {
  const errors = validationResult(req)
  if (!errors.isEmpty()) {
    const err = res
      .status(422)
      .json({ message: 'Invalid inputs passed, please check your data.' })

    return next(err)
  }

  const { title, description, address } = req.body

  let coordinates

  try {
    coordinates = await getCoordsForAddress(address)
  } catch (error) {
    return next(error)
  }

  const createdPlace = new Place({
    title,
    description,
    address,
    location: coordinates,
    image: req.file.path,
    creator: req.userData.userId,
  })

  let user
  try {
    user = await User.findById(req.userData.userId)
  } catch (error) {
    const err = res
      .status(500)
      .json({ msaage: 'Creating place failed, please try again.' })

    return next(err)
  }

  if (!user) {
    const err = res
      .status(404)
      .json({ message: 'Could not find user for provided id.' })

    return next(err)
  }

  console.log(user, 'user')

  try {
    const sess = await mongoose.startSession()
    sess.startTransaction()
    await createdPlace.save({ session: sess })
    user.places.push(createdPlace)
    await user.save({ session: sess })
    await sess.commitTransaction()
  } catch (error) {
    const err = res
      .status(500)
      .json({ message: ' Creating place failed, please try again.' })

    return next(err)
  }

  res.status(201).json({ place: createdPlace })
}

const updatePlace = async (req: Request, res: Response, next: NextFunction) => {
  try {
  } catch (error) {}
}

const deletePlace = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {}

export {
  getPlaceById,
  getPlacesByUserId,
  createPlace,
  updatePlace,
  deletePlace,
}
