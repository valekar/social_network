import { IPost, Post, IComment, IPhoto } from "@models";
import {
  ResourceNotFoundError,
  DatabaseError,
  ResourceAlreadyExistsError
} from "@errors";

export interface IPostComment {
  postId: String;
  commentId: String;
  comment: IComment | null;
}

export interface IPostPhoto {
  postId: String;
  photo: IPhoto | null;
  photoId: String;
}

export interface ICommentData {
  _id?: String;
  comment: IComment | null;
}

export interface IPhotoData {
  _id?: String;
  photo: IPhoto | null;
}

export interface IPostDao {
  getOne: (value: string) => Promise<IPost | null>;
  getAll: () => Promise<IPost[]>;
  add: (Post: IPost) => Promise<IPost>;
  update: (Post: IPost, id: string) => Promise<void>;
  delete: (id: string) => Promise<void>;
  updateComment: (postComment: IPostComment) => Promise<void>;
  addComment: (postComment: IPostComment) => Promise<ICommentData | null>;
  deleteComment: (postComment: IPostComment) => Promise<void>;

  addPhoto: (postPhoto: IPostPhoto) => Promise<IPhotoData | null>;
  deletePhoto: (postPhoto: IPostPhoto) => Promise<void>;
}

export class PostDao implements IPostDao {
  public async updateComment(postComment: IPostComment): Promise<void> {
    try {
      const post = await Post.update(
        { "comments._id": postComment.commentId },
        { $set: { "comments.$.comment": postComment.comment } },
        { upsert: true }
      );
      if (post != null) {
        return post;
      }
      throw new ResourceNotFoundError("Could not find Post");
    } catch (err) {
      if (err instanceof ResourceNotFoundError) {
        throw new ResourceNotFoundError(err.message);
      }
      throw new DatabaseError(err);
    }
  }

  public async addComment(
    postComment: IPostComment
  ): Promise<ICommentData | null> {
    try {
      const post = await Post.findById(postComment.postId);
      if (post != null) {
        post.comments.push({ comment: postComment.comment });
        const result = await post.save();
        const comment = result.comments[post.comments.length - 1];
        return comment;
      }
      throw new ResourceNotFoundError("Could not find Post");
    } catch (err) {
      if (err instanceof ResourceNotFoundError) {
        throw new ResourceNotFoundError(err.message);
      }
      throw new DatabaseError(err);
    }
  }
  public async deleteComment(postComment: IPostComment): Promise<void> {
    try {
      const comment = await Post.update(
        {
          _id: postComment.postId
        },
        { $pull: { comments: { _id: postComment.commentId } } }
      );
      if (comment.n == 0) {
        throw new ResourceNotFoundError("Could not find post");
      }
      if (comment.nModified == 0) {
        throw new ResourceNotFoundError("Could not find comment");
      }
    } catch (err) {
      if (err instanceof ResourceNotFoundError) {
        throw new ResourceNotFoundError(err.message);
      }
      throw new DatabaseError(err);
    }
  }
  public async addPhoto(postPhoto: IPostPhoto): Promise<IPhotoData | null> {
    try {
      const post = await Post.findById(postPhoto.postId);
      if (post != null) {
        post.photos.push({ photo: postPhoto.photo });
        const result = await post.save();
        const photo = result.photos[post.photos.length - 1];
        return photo;
      }
      throw new ResourceNotFoundError("Could not find Post");
    } catch (err) {
      if (err instanceof ResourceNotFoundError) {
        throw new ResourceNotFoundError(err.message);
      }
      throw new DatabaseError(err);
    }
  }
  public async deletePhoto(postPhoto: IPostPhoto): Promise<void> {
    try {
      const photo = await Post.update(
        {
          _id: postPhoto.postId
        },
        { $pull: { photos: { _id: postPhoto.photoId } } }
      );
      if (photo.n == 0) {
        throw new ResourceNotFoundError("Could not find post");
      }
      if (photo.nModified == 0) {
        throw new ResourceNotFoundError("Could not find photo");
      }
    } catch (err) {
      if (err instanceof ResourceNotFoundError) {
        throw new ResourceNotFoundError(err.message);
      }
      throw new DatabaseError(err);
    }
  }

  public async getOne(value: string): Promise<IPost | null> {
    try {
      const post = await Post.findOne({ _id: value });
      return post;
    } catch (err) {
      throw new ResourceNotFoundError(err);
    }
  }
  public async getAll(): Promise<IPost[]> {
    try {
      const Posts = await Post.find();
      return Posts;
    } catch (err) {
      throw new ResourceNotFoundError(err);
    }
  }
  public async add(post: IPost): Promise<IPost> {
    try {
      const newPost = new Post({
        title: post.title,
        description: post.description,
        abuse: post.abuse,
        active: post.active,
        userId: post.userId,
        categoryId: post.categoryId,
        photos: post.photos,
        comments: post.comments
      });
      const result = await newPost.save();
      return result;
    } catch (err) {
      if (err instanceof ResourceAlreadyExistsError) {
        throw new ResourceAlreadyExistsError(err.message);
      }
      throw new DatabaseError(err);
    }
  }
  public async update(post: IPost, id: string): Promise<void> {
    try {
      let updatePost = await Post.findById(id);

      if (updatePost) {
        if (post.title) {
          updatePost.title = post.title;
        }
        if (post.description) {
          updatePost.description = post.description;
        }
        if (post.abuse) {
          updatePost.abuse = post.abuse;
        }
        if (post.categoryId) {
          updatePost.categoryId = post.categoryId;
        }
        if (post.active) {
          updatePost.active = post.active;
        }
        await updatePost.save();
      } else {
        throw new ResourceNotFoundError("Post not found");
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
      let deletePost = await Post.findByIdAndDelete(id);
      if (!deletePost) {
        throw new ResourceNotFoundError(
          "Could not delete Post, Post not found"
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
