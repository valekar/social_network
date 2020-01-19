import mongoose, { Document } from "mongoose";
import { IBase } from "./Base";
const Schema = mongoose.Schema;

export interface IGroup extends Document, IBase {
  name: string;
  value: number;
}

const groupSchema = new Schema({
  name: {
    type: String,
    required: true
  },
  value: {
    type: Number,
    required: true
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

export const Group = mongoose.model<IGroup>("Group", groupSchema);
