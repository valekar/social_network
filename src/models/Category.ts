import mongoose, { Document } from "mongoose";
import { IBase } from "./Base";
const Schema = mongoose.Schema;

export interface ICategory extends Document, IBase {
  name: String;
  active: Boolean;
}

const categorySchema = new Schema({
  name: {
    type: String
  },
  active: {
    type: Boolean,
    default: true
  },
  createdAt: {
    type: Date,
    default: Date.now()
  },
  updatedAt: {
    type: Date,
    default: Date.now()
  }
});

export const Category = mongoose.model<ICategory>("Category", categorySchema);
