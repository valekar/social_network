import { Request, Response, Router } from "express";
import { BAD_REQUEST, CREATED, OK } from "http-status-codes";
import { ParamsDictionary } from "express-serve-static-core";
import { PhotoDao } from "@daos";
import { paramMissingError, logger, adminMW } from "@shared";
import upload from "../helpers/storageBuilder";
const Grid = require("gridfs-stream");
const mongoose = require("mongoose");
const mongoURI = process.env.MONGO_URL;

const router = Router();
const photoDao = new PhotoDao();

/******************************************************************************
 *                      Additional Routes START
 ******************************************************************************/
router.post("/upload", upload.single("file"), (req: any, res: any) => {
  res.json({ file: req.file });
});

router.get("/upload", (req, res) => {
  const conn = mongoose.createConnection(mongoURI);
  conn.once("open", () => {
    // Init stream
    let gfs = Grid(conn.db, mongoose.mongo);
    gfs.collection("uploads");
    gfs.files.find().toArray((err: any, files: any) => {
      // Check if files
      if (!files || files.length === 0) {
        return res.status(404).json({
          err: "No files exist"
        });
      }

      // Files exist
      conn.close();
      return res.json(files);
    });
  });
});

router.get("/upload/:filename", (req, res) => {
  const conn = mongoose.createConnection(mongoURI);
  conn.once("open", () => {
    let gfs = Grid(conn.db, mongoose.mongo);
    gfs.collection("uploads");
    gfs.files.findOne(
      { filename: req.params.filename },
      (err: any, file: any) => {
        // Check if file
        if (!file || file.length === 0) {
          return res.status(404).json({
            err: "No file exists"
          });
        }

        // Check if image
        if (
          file.contentType === "image/jpeg" ||
          file.contentType === "image/png"
        ) {
          // Read output to browser
          const readstream = gfs.createReadStream(file.filename);
          readstream.pipe(res);
        } else {
          res.status(404).json({
            err: "Not an image"
          });
        }
      }
    );
  });
});
/******************************************************************************
 *                      Additonal Routes END
 ******************************************************************************/

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
