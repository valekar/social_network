import mongoose, { Document } from "mongoose";
import { IBase } from "./Base";
import { IPhoto } from "./Photo";
import { IComment } from "./Comment";
const Schema = mongoose.Schema;

export interface IPost extends Document, IBase {
  title: String;
  description: String;
  photos: [
    {
      photoData: IPhoto;
    }
  ];
  comment: [
    {
      commentData: IComment;
    }
  ];
  userId: String;
  categoryId: String;
}

const postSchema = new Schema({
  title: {
    type: String,
    required: true
  },
  description: {
    type: String
  },
  photos: [
    {
      photoData: {
        type: Object
      }
    }
  ],
  abuse: Number
});

export const Post = mongoose.model<IPost>("Post", postSchema);
