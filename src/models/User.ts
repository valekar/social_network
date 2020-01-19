import mongoose, { Document } from "mongoose";
import { IGroup } from "./Group";
import { IBase } from "./Base";
import { ObjectId } from "mongodb";
const Schema = mongoose.Schema;
export interface IUser extends Document, IBase {
  name: string;
  email: string;
  groups: [
    {
      groupsData: IGroup;
    }
  ];
  password: string;
  firstName: String;
  lastName: String;
  phoneNumber: String;
}

const userSchema = new Schema({
  name: {
    type: String,
    require: true
  },
  email: {
    type: String
  },
  groups: [
    {
      _id: { type: ObjectId, required: true },
      groupsData: {
        type: Object,
        required: true
      }
    }
  ],
  firstName: String,
  lastName: String,
  phoneNumber: String,
  password: {
    type: String,
    required: true
  },
  abuse: Number,
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

export const User = mongoose.model<IUser>("User", userSchema);
