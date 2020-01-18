import mongoose, { Document } from "mongoose";
const Schema = mongoose.Schema;

export interface IGroup extends Document {
  name: String;
  value: Number;
}

const groupSchema = new Schema({
  name: {
    type: String,
    required: true
  },
  value: {
    type: Number,
    required: true
  }
});

export const Group = mongoose.model<IGroup>("Group", groupSchema);
