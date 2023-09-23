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
  try {
  } catch (error) {}
}

const updatePlace = async (req: Request, res: Response, next: NextFunction) => {
  try {
  } catch (error) {}
}

const deletePlace = async (req: Request, res: Response, next: NextFunction) => {
  try {
  } catch (error) {}
}

export {
  getPlaceById,
  getPlacesByUserId,
  createPlace,
  updatePlace,
  deletePlace,
}
