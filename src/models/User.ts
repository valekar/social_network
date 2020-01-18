import mongoose, { Document } from "mongoose";
import { IGroup } from "./Group";
const Schema = mongoose.Schema;
export interface IUser extends Document {
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
  abuse: Number
});

export const User = mongoose.model<IUser>("User", userSchema);
