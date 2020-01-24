import { Request, Response, Router } from "express";
import { BAD_REQUEST, CREATED, OK } from "http-status-codes";
import { ParamsDictionary } from "express-serve-static-core";
import { PostDao, IPostComment, IPostPhoto } from "@daos";
import { paramMissingError, logger, adminMW } from "@shared";

const router = Router();
const postDao = new PostDao();

/******************************************************************************
 *                      Get All Posts - "GET /api/posts/"
 ******************************************************************************/

router.get("/", adminMW, async (req: Request, res: Response) => {
  try {
    const posts = await postDao.getAll();
    return res.status(OK).json({ posts });
  } catch (err) {
    logger.error(err.message, err);
    return res.status(BAD_REQUEST).json({
      error: err.message
    });
  }
});

/******************************************************************************
 *                      Get a Post - "GET /api/posts/:id"
 ******************************************************************************/

router.get("/:id", adminMW, async (req: Request, res: Response) => {
  try {
    const { id } = req.params as ParamsDictionary;
    if (!id) {
      return res.status(BAD_REQUEST).json({
        error: paramMissingError
      });
    }
    const post = await postDao.getOne(id);
    return res.status(OK).json({ post });
  } catch (err) {
    logger.error(err.message, err);
    return res.status(BAD_REQUEST).json({
      error: err.message
    });
  }
});

/******************************************************************************
 *                      Add a Post - "POST /api/posts/"
 ******************************************************************************/
router.post("/", adminMW, async (req: Request, res: Response) => {
  try {
    const { post } = req.body;
    if (!post) {
      return res.status(BAD_REQUEST).json({
        error: paramMissingError
      });
    }
    const result = await postDao.add(post);
    return res.status(CREATED).json(result);
  } catch (err) {
    logger.error(err.message, err);
    return res.status(BAD_REQUEST).json({
      error: err.message
    });
  }
});

/******************************************************************************
 *                      update a Post - "PUT /api/posts/:id"
 ******************************************************************************/
router.put("/:id", adminMW, async (req: Request, res: Response) => {
  try {
    const { id } = req.params as ParamsDictionary;
    const { post } = req.body;
    if (!post || !id) {
      return res.status(BAD_REQUEST).json({
        error: paramMissingError
      });
    }
    await postDao.update(post, id);
    return res.status(CREATED).end();
  } catch (err) {
    logger.error(err.message, err);
    return res.status(BAD_REQUEST).json({
      error: err.message
    });
  }
});

/******************************************************************************
 *                      delete a Post - "DELETE /api/posts/:id"
 ******************************************************************************/
router.delete("/:id", adminMW, async (req: Request, res: Response) => {
  try {
    const { id } = req.params as ParamsDictionary;
    await postDao.delete(id);
    return res.status(OK).end();
  } catch (err) {
    logger.error(err.message, err);
    return res.status(BAD_REQUEST).json({
      error: err.message
    });
  }
});

/**************************************************************************************************************
 *                     ADDITIONAL ROUTES
 **************************************************************************************************************/

/******************************************************************************
 *                      Add a comment to Post - "POST /api/posts/:id/comments/"
 ******************************************************************************/
router.post("/:id/comments/", adminMW, async (req: Request, res: Response) => {
  try {
    const { id } = req.params as ParamsDictionary;
    const { postComment } = req.body;

    const postIComment: IPostComment = {
      postId: id,
      comment: postComment.comment,
      commentId: ""
    };
    if (!postIComment) {
      return res.status(BAD_REQUEST).json({
        error: paramMissingError
      });
    }
    const post = await postDao.addComment(postIComment);
    return res.status(CREATED).json(post);
  } catch (err) {
    logger.error(err.message, err);
    return res.status(BAD_REQUEST).json({
      error: err.message
    });
  }
});

/******************************************************************************
 *                      Edit a comment to Post - "PUT /api/posts/:id/comments/:id"
 ******************************************************************************/
router.put(
  "/:id/comments/:commentId",
  adminMW,
  async (req: Request, res: Response) => {
    try {
      const { id, commentId } = req.params as ParamsDictionary;
      const { postComment } = req.body;

      const postIComment: IPostComment = {
        postId: id,
        comment: postComment.comment,
        commentId: commentId
      };
      if (!postIComment) {
        return res.status(BAD_REQUEST).json({
          error: paramMissingError
        });
      }
      await postDao.updateComment(postIComment);
      return res.status(CREATED).end();
    } catch (err) {
      logger.error(err.message, err);
      return res.status(BAD_REQUEST).json({
        error: err.message
      });
    }
  }
);

/******************************************************************************
 *                      DELETE a comment to Post - "DELETE /api/posts/:id/comments/:id"
 ******************************************************************************/
router.delete(
  "/:id/comments/:commentId",
  adminMW,
  async (req: Request, res: Response) => {
    try {
      const { id, commentId } = req.params as ParamsDictionary;

      const postIComment: IPostComment = {
        postId: id,
        comment: null,
        commentId: commentId
      };
      await postDao.deleteComment(postIComment);
      return res.status(CREATED).end();
    } catch (err) {
      logger.error(err.message, err);
      return res.status(BAD_REQUEST).json({
        error: err.message
      });
    }
  }
);

/******************************************************************************
 *                      Add a photo to Post - "POST /api/posts/:id/photos/"
 ******************************************************************************/
router.post("/:id/photos/", adminMW, async (req: Request, res: Response) => {
  try {
    const { id } = req.params as ParamsDictionary;
    const { postPhoto } = req.body;

    const postIPhoto: IPostPhoto = {
      postId: id,
      photo: postPhoto.photo,
      photoId: ""
    };
    if (!postIPhoto) {
      return res.status(BAD_REQUEST).json({
        error: paramMissingError
      });
    }
    const post = await postDao.addPhoto(postIPhoto);
    return res.status(CREATED).json(post);
  } catch (err) {
    logger.error(err.message, err);
    return res.status(BAD_REQUEST).json({
      error: err.message
    });
  }
});

/******************************************************************************
 *                      DELETE a photo to Post - "DELETE /api/posts/:id/photos/:id"
 ******************************************************************************/
router.delete(
  "/:id/photos/:photoId",
  adminMW,
  async (req: Request, res: Response) => {
    try {
      const { id, photoId } = req.params as ParamsDictionary;

      const postIPhoto: IPostPhoto = {
        postId: id,
        photo: null,
        photoId: photoId
      };
      await postDao.deletePhoto(postIPhoto);
      return res.status(CREATED).end();
    } catch (err) {
      logger.error(err.message, err);
      return res.status(BAD_REQUEST).json({
        error: err.message
      });
    }
  }
);

export default router;
