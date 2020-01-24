import { Request, Response, Router } from "express";
import { BAD_REQUEST, CREATED, OK } from "http-status-codes";
import { ParamsDictionary } from "express-serve-static-core";
import { GroupDao } from "@daos";
import { paramMissingError, logger, adminMW } from "@shared";

const router = Router();
const groupDao = new GroupDao();

/******************************************************************************
 *                      Get All Groups - "GET /api/groups/"
 ******************************************************************************/

router.get("/", adminMW, async (req: Request, res: Response) => {
  try {
    const groups = await groupDao.getAll();
    return res.status(OK).json({ groups });
  } catch (err) {
    logger.error(err.message, err);
    return res.status(BAD_REQUEST).json({
      error: err.message
    });
  }
});

/******************************************************************************
 *                      Get a group - "GET /api/groups/:id"
 ******************************************************************************/

router.get("/:id", async (req: Request, res: Response) => {
  try {
    const { id } = req.params as ParamsDictionary;
    if (!id) {
      return res.status(BAD_REQUEST).json({
        error: paramMissingError
      });
    }
    const group = await groupDao.getOne(id);
    return res.status(OK).json({ group });
  } catch (err) {
    logger.error(err.message, err);
    return res.status(BAD_REQUEST).json({
      error: err.message
    });
  }
});

/******************************************************************************
 *                      Add a group - "POST /api/groups/"
 ******************************************************************************/
router.post("/", adminMW, async (req: Request, res: Response) => {
  try {
    const { group } = req.body;
    if (!group) {
      return res.status(BAD_REQUEST).json({
        error: paramMissingError
      });
    }
    const result = await groupDao.add(group);
    return res.status(CREATED).json(result);
  } catch (err) {
    logger.error(err.message, err);
    return res.status(BAD_REQUEST).json({
      error: err.message
    });
  }
});

/******************************************************************************
 *                      update a group - "PUT /api/groups/:id"
 ******************************************************************************/
router.put("/:id", adminMW, async (req: Request, res: Response) => {
  try {
    const { id } = req.params as ParamsDictionary;
    const { group } = req.body;
    if (!group || !id) {
      return res.status(BAD_REQUEST).json({
        error: paramMissingError
      });
    }
    await groupDao.update(group, id);
    return res.status(CREATED).end();
  } catch (err) {
    logger.error(err.message, err);
    return res.status(BAD_REQUEST).json({
      error: err.message
    });
  }
});

/******************************************************************************
 *                      delete a group - "DELETE /api/groups/:id"
 ******************************************************************************/
router.delete("/:id", adminMW, async (req: Request, res: Response) => {
  try {
    const { id } = req.params as ParamsDictionary;
    await groupDao.delete(id);
    return res.status(OK).end();
  } catch (err) {
    logger.error(err.message, err);
    return res.status(BAD_REQUEST).json({
      error: err.message
    });
  }
});

export default router;
