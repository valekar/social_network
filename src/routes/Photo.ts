import { Request, Response, Router } from "express";
import { BAD_REQUEST, CREATED, OK } from "http-status-codes";
import { ParamsDictionary } from "express-serve-static-core";
import { PhotoDao } from "@daos";
import { paramMissingError, logger, adminMW } from "@shared";

const router = Router();
const photoDao = new PhotoDao();

/******************************************************************************
 *                      Get All Photos - "GET /api/photos/"
 ******************************************************************************/

router.get("/", adminMW, async (req: Request, res: Response) => {
  try {
    const photos = await photoDao.getAll();
    return res.status(OK).json({ photos });
  } catch (err) {
    logger.error(err.message, err);
    return res.status(BAD_REQUEST).json({
      error: err.message
    });
  }
});

/******************************************************************************
 *                      Get a Photo - "GET /api/photos/:id"
 ******************************************************************************/

router.get("/:id", adminMW, async (req: Request, res: Response) => {
  try {
    const { id } = req.params as ParamsDictionary;
    if (!id) {
      return res.status(BAD_REQUEST).json({
        error: paramMissingError
      });
    }
    const photo = await photoDao.getOne(id);
    return res.status(OK).json({ photo });
  } catch (err) {
    logger.error(err.message, err);
    return res.status(BAD_REQUEST).json({
      error: err.message
    });
  }
});

/******************************************************************************
 *                      Add a Photo - "POST /api/photos/"
 ******************************************************************************/
router.post("/", adminMW, async (req: Request, res: Response) => {
  try {
    const { photo } = req.body;
    if (!photo) {
      return res.status(BAD_REQUEST).json({
        error: paramMissingError
      });
    }
    const result = await photoDao.add(photo);
    return res.status(CREATED).json(result);
  } catch (err) {
    logger.error(err.message, err);
    return res.status(BAD_REQUEST).json({
      error: err.message
    });
  }
});

/******************************************************************************
 *                      update a Photo - "PUT /api/photos/:id"
 ******************************************************************************/
router.put("/:id", adminMW, async (req: Request, res: Response) => {
  try {
    const { id } = req.params as ParamsDictionary;
    const { photo } = req.body;
    if (!photo || !id) {
      return res.status(BAD_REQUEST).json({
        error: paramMissingError
      });
    }
    await photoDao.update(photo, id);
    return res.status(CREATED).end();
  } catch (err) {
    logger.error(err.message, err);
    return res.status(BAD_REQUEST).json({
      error: err.message
    });
  }
});

/******************************************************************************
 *                      delete a Photo - "DELETE /api/photos/:id"
 ******************************************************************************/
router.delete("/:id", adminMW, async (req: Request, res: Response) => {
  try {
    const { id } = req.params as ParamsDictionary;
    await photoDao.delete(id);
    return res.status(OK).end();
  } catch (err) {
    logger.error(err.message, err);
    return res.status(BAD_REQUEST).json({
      error: err.message
    });
  }
});

export default router;
