import { IPost, Post, IComment, IPhoto } from "@models";
import {
  ResourceNotFoundError,
  DatabaseError,
  ResourceAlreadyExistsError
} from "@errors";

export interface IPostDao {
  getOne: (value: string) => Promise<IPost | null>;
  getAll: () => Promise<IPost[]>;
  add: (Post: IPost) => Promise<IPost>;
  update: (Post: IPost, id: string) => Promise<void>;
  delete: (id: string) => Promise<void>;
  updateComment: (
    postId: String,
    commentId: String,
    comment: IComment
  ) => Promise<void>;
  addComment: (postId: String, comment: IComment) => Promise<IComment | null>;
  deleteComment: (postId: String, commentId: String) => Promise<void>;

  addPhoto: (postId: String, photo: IPhoto) => Promise<IPhoto | null>;
  deletePhoto: (postId: String, photoId: String) => Promise<void>;
}

export class PostDao implements IPostDao {
  public async updateComment(
    postId: String,
    commentId: String,
    comment: IComment
  ): Promise<void> {
    try {
    } catch (err) {}
  }
  public async addComment(
    postId: String,
    comment: IComment
  ): Promise<IComment | null> {
    return null;
  }
  public async deleteComment(
    postId: String,
    commentId: String
  ): Promise<void> {}
  public async addPhoto(postId: String, photo: IPhoto): Promise<IPhoto | null> {
    return null;
  }
  public async deletePhoto(postId: String, photoId: String): Promise<void> {}

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
      await newPost.save();
      return newPost;
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
