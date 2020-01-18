/**
 * Comment can also be used as Reviews
 */
import mongoose, { Document } from "mongoose";
import { IBase } from "./Base";

const Schema = mongoose.Schema;

export interface IComment extends Document, IBase {
  description: String;
  userId: String;
  rating: Number;
}

const commentSchema = new Schema({
  description: {
    type: String
  },
  userId: {
    type: String,
    required: true
  },
  rating: {
    type: Number
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

export const Comment = mongoose.model<IComment>("Comment", commentSchema);
