import mongoose from "mongoose";

const Schema = mongoose.Schema

const coordinatesSchema = new Schema({
    longitude: mongoose.Types.Decimal128,
    latitude: mongoose.Types.Decimal128
})

export const Coordinates = mongoose.model('Coordinates', coordinatesSchema)