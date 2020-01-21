import mongoose, { Document } from "mongoose";
import { IBase } from "./Base";
import { IPhoto } from "./Photo";
import { IComment } from "./Comment";
import { ObjectId } from "mongodb";
const Schema = mongoose.Schema;

export interface IPost extends Document, IBase {
  title: String;
  description: String;
  photos: [
    {
      photoData: IPhoto;
    }
  ];
  comments: [
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
      photo: {
        type: Object
      }
    }
  ],
  comments: [
    {
      comment: {
        type: Object
      }
    }
  ],
  abuse: Number,
  categoryId: ObjectId,
  userId: ObjectId
});

export const Post = mongoose.model<IPost>("Post", postSchema);
