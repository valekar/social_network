import { Request, Response, Router } from "express";
import { BAD_REQUEST, CREATED, OK } from "http-status-codes";
import { ParamsDictionary } from "express-serve-static-core";
import { UserDao } from "@daos";
import { paramMissingError, logger, adminMW } from "@shared";

// Init shared
const router = Router();
const userDao = new UserDao();

/******************************************************************************
 *                      Get All Users - "GET /api/users/"
 ******************************************************************************/

router.get("/", adminMW, async (req: Request, res: Response) => {
  try {
    const users = await userDao.getAll();
    return res.status(OK).json({ users });
  } catch (err) {
    logger.error(err.message, err);
    return res.status(BAD_REQUEST).json({
      error: err.message
    });
  }
});

/******************************************************************************
 *                      Get an User - "GET /api/users/email"
 ******************************************************************************/

router.get("/email", async (req: Request, res: Response) => {
  try {
    const { email } = req.query as ParamsDictionary;
    if (!email) {
      return res.status(BAD_REQUEST).json({
        error: paramMissingError
      });
    }
    const group = await userDao.getOneByEmail(email);
    return res.status(OK).json({ group });
  } catch (err) {
    logger.error(err.message, err);
    return res.status(BAD_REQUEST).json({
      error: err.message
    });
  }
});

/******************************************************************************
 *                      Get an User - "GET /api/users/:id"
 ******************************************************************************/

router.get("/:id", async (req: Request, res: Response) => {
  try {
    const { id } = req.params as ParamsDictionary;
    if (!id) {
      return res.status(BAD_REQUEST).json({
        error: paramMissingError
      });
    }
    const group = await userDao.getOneById(id);
    return res.status(OK).json({ group });
  } catch (err) {
    logger.error(err.message, err);
    return res.status(BAD_REQUEST).json({
      error: err.message
    });
  }
});

/******************************************************************************
 *                       Add One - "POST /api/users/"
 ******************************************************************************/

router.post("/", adminMW, async (req: Request, res: Response) => {
  try {
    // Check parameters
    const { user } = req.body;
    if (!user) {
      return res.status(BAD_REQUEST).json({
        error: paramMissingError
      });
    }
    // Add new user

    const result = await userDao.add(user);
    //console.log(result);
    return res.status(CREATED).json(result);
  } catch (err) {
    logger.error(err.message, err);
    return res.status(BAD_REQUEST).json({
      error: err.message
    });
  }
});

/******************************************************************************
 *                       Update - "PUT /api/users/:id"
 ******************************************************************************/

router.put("/:id", adminMW, async (req: Request, res: Response) => {
  try {
    // Check Parameters
    const { user } = req.body;
    const { id } = req.params as ParamsDictionary;
    if (!user || !id) {
      return res.status(BAD_REQUEST).json({
        error: paramMissingError
      });
    }

    await userDao.update(user, id);
    return res.status(OK).end();
  } catch (err) {
    logger.error(err.message, err);
    return res.status(BAD_REQUEST).json({
      error: err.message
    });
  }
});

/******************************************************************************
 *                    Delete - "DELETE /api/users/:id"
 ******************************************************************************/

router.delete("/:id", adminMW, async (req: Request, res: Response) => {
  try {
    const { id } = req.params as ParamsDictionary;
    await userDao.delete(Number(id));
    return res.status(OK).end();
  } catch (err) {
    logger.error(err.message, err);
    return res.status(BAD_REQUEST).json({
      error: err.message
    });
  }
});

/******************************************************************************
 *                                     Export
 ******************************************************************************/

export default router;
