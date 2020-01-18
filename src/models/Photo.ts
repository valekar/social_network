import mongoose, { Document } from "mongoose";
import { IBase } from "./Base";
const Schema = mongoose.Schema;

export interface IPhoto extends Document, IBase {
  title: String;
  photoUrl: String;
}

const photoSchema = new Schema({
  title: {
    type: String,
    required: true
  },
  photoUrl: {
    type: String,
    required: true
  },
  createdAt: {
    type: Date,
    default: Date.now()
  },
  updatedAt: {
    type: Date,
    default: Date.now()
  },
  abuse: Number
});

export const Photo = mongoose.model<IPhoto>("Photo", photoSchema);
