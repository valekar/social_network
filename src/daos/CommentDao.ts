import { IComment, Comment } from "@models";
import {
  ResourceNotFoundError,
  DatabaseError,
  ResourceAlreadyExistsError
} from "@errors";

export interface ICommentDao {
  getOne: (value: string) => Promise<IComment | null>;
  getAll: () => Promise<IComment[]>;
  add: (comment: IComment) => Promise<IComment>;
  update: (comment: IComment, id: string) => Promise<void>;
  delete: (id: string) => Promise<void>;
}

export class CommentDao implements ICommentDao {
  public async getOne(value: string): Promise<IComment | null> {
    try {
      const comment = await Comment.findOne({ _id: value });
      return comment;
    } catch (err) {
      throw new ResourceNotFoundError(err);
    }
  }
  public async getAll(): Promise<IComment[]> {
    try {
      const comments = await Comment.find();
      return comments;
    } catch (err) {
      throw new ResourceNotFoundError(err);
    }
  }
  public async add(comment: IComment): Promise<IComment> {
    try {
      const newComment = new Comment({
        description: comment.description,
        rating: comment.rating,
        userId: comment.userId,
        abuse: comment.abuse,
        active: comment.active
      });
      const result = await newComment.save();
      return result;
    } catch (err) {
      if (err instanceof ResourceAlreadyExistsError) {
        throw new ResourceAlreadyExistsError(err.message);
      }
      throw new DatabaseError(err);
    }
  }
  public async update(comment: IComment, id: string): Promise<void> {
    try {
      let updateComment = await Comment.findById(id);

      if (updateComment) {
        if (comment.description) {
          updateComment.description = comment.description;
        }
        if (comment.rating) {
          updateComment.rating = comment.rating;
        }
        if (comment.abuse) {
          updateComment.abuse = comment.abuse;
        }
        if (comment.active) {
          updateComment.active = comment.active;
        }
        await updateComment.save();
      } else {
        throw new ResourceNotFoundError("Comment not found");
      }
    } catch (err) {
      if (err instanceof ResourceNotFoundError) {
        throw new ResourceNotFoundError(err.message);
      }
      throw new DatabaseError(err);
    }
  }
  public async delete(id: string): Promise<void> {
    try {
      let deleteComment = await Comment.findByIdAndDelete(id);
      if (!deleteComment) {
        throw new ResourceNotFoundError(
          "Could not delete Comment, Comment not found"
        );
      }
    } catch (err) {
      if (err instanceof ResourceNotFoundError) {
        throw new ResourceNotFoundError(err.message);
      }
      throw new DatabaseError(err);
    }
  }
}
