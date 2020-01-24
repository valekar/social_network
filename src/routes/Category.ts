import { Request, Response, Router } from "express";
import { BAD_REQUEST, CREATED, OK } from "http-status-codes";
import { ParamsDictionary } from "express-serve-static-core";
import { CategoryDao } from "@daos";
import { paramMissingError, logger, adminMW } from "@shared";

const router = Router();
const categoryDao = new CategoryDao();

/******************************************************************************
 *                      Get All categories - "GET /api/categories/"
 ******************************************************************************/

router.get("/", adminMW, async (req: Request, res: Response) => {
  try {
    const categories = await categoryDao.getAll();
    return res.status(OK).json({ categories });
  } catch (err) {
    logger.error(err.message, err);
    return res.status(BAD_REQUEST).json({
      error: err.message
    });
  }
});

/******************************************************************************
 *                      Get a category - "GET /api/categories/:id"
 ******************************************************************************/

router.get("/:id", async (req: Request, res: Response) => {
  try {
    const { id } = req.params as ParamsDictionary;
    if (!id) {
      return res.status(BAD_REQUEST).json({
        error: paramMissingError
      });
    }
    const category = await categoryDao.getOne(id);
    return res.status(OK).json({ category });
  } catch (err) {
    logger.error(err.message, err);
    return res.status(BAD_REQUEST).json({
      error: err.message
    });
  }
});

/******************************************************************************
 *                      Add a category - "POST /api/categories/"
 ******************************************************************************/
router.post("/", adminMW, async (req: Request, res: Response) => {
  try {
    const { category } = req.body;
    if (!category) {
      return res.status(BAD_REQUEST).json({
        error: paramMissingError
      });
    }
    const result = await categoryDao.add(category);
    return res.status(CREATED).json(result);
  } catch (err) {
    logger.error(err.message, err);
    return res.status(BAD_REQUEST).json({
      error: err.message
    });
  }
});

/******************************************************************************
 *                      update a category - "PUT /api/categories/:id"
 ******************************************************************************/
router.put("/:id", adminMW, async (req: Request, res: Response) => {
  try {
    const { id } = req.params as ParamsDictionary;
    const { category } = req.body;
    if (!category || !id) {
      return res.status(BAD_REQUEST).json({
        error: paramMissingError
      });
    }
    await categoryDao.update(category, id);
    return res.status(CREATED).end();
  } catch (err) {
    logger.error(err.message, err);
    return res.status(BAD_REQUEST).json({
      error: err.message
    });
  }
});

/******************************************************************************
 *                      delete a category - "DELETE /api/categories/:id"
 ******************************************************************************/
router.delete("/:id", adminMW, async (req: Request, res: Response) => {
  try {
    const { id } = req.params as ParamsDictionary;
    await categoryDao.delete(id);
    return res.status(OK).end();
  } catch (err) {
    logger.error(err.message, err);
    return res.status(BAD_REQUEST).json({
      error: err.message
    });
  }
});

export default router;
