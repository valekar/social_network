import { Request, Response, Router } from "express";

import upload from "../helpers/storageBuilder";
import { DatabaseError } from "@errors";
import { adminMW, logger, paramMissingError } from "@shared";
import { INTERNAL_SERVER_ERROR, BAD_REQUEST, OK } from "http-status-codes";
import { ParamsDictionary } from "express-serve-static-core";

import { connection } from "mongoose";
const Grid = require("gridfs-stream");
const mongoose = require("mongoose");
const mongoURI = process.env.MONGO_URL;

const router = Router();

const openConnection = async () => {
  try {
    const connection = mongoose.createConnection(mongoURI);
    await connection.once("open", () => {});
    let gfs = Grid(connection.db, mongoose.mongo);
    gfs.collection("uploads");
    return [gfs, connection];
  } catch (err) {
    throw new DatabaseError(err.message);
  }
};
/******************************************************************************
 *                      FILE - POST /api/files/
 ******************************************************************************/
router.post("/", [adminMW, upload.single("file")], (req: any, res: any) => {
  res.json({ file: req.file });
});

/******************************************************************************
 *                      FILE - GET ALL /api/files/
 ******************************************************************************/
router.get("/", adminMW, async (req: Request, res: Response) => {
  try {
    const [gfs, connection] = await openConnection();
    const files = await gfs.files.find().toArray();
    if (!files || files.length === 0) {
      return res.status(404).json({
        err: "No files exist"
      });
    }
    return res.json(files);
  } catch (err) {
    res.status(INTERNAL_SERVER_ERROR).json({
      err: err.message
    });
  } finally {
    logger.info("Closing MongoDB connection");
    connection.close();
  }
});

/******************************************************************************
 *                      FILE - GET ONE /api/files/:filename
 ******************************************************************************/
router.get("/:filename", adminMW, async (req: Request, res: Response) => {
  //let connection;
  try {
    const { filename } = req.params as ParamsDictionary;
    if (!filename) {
      return res.status(BAD_REQUEST).json({
        error: paramMissingError
      });
    }

    const [gfs, connection] = await openConnection();

    const file = await gfs.files.findOne({ filename: filename });

    if (!file || file.length === 0) {
      return res.status(404).json({
        err: "No file exists"
      });
    }
    if (file.contentType === "image/jpeg" || file.contentType === "image/png") {
      // Read output to browser
      const readstream = gfs.createReadStream(file.filename);
      readstream.pipe(res);
    } else {
      res.status(404).json({
        err: "Not an image"
      });
    }
  } catch (err) {
    res.status(INTERNAL_SERVER_ERROR).json({
      err: err.message
    });
  } finally {
    logger.info("Closing MongoDB connection");
    connection.close();
  }
});

/******************************************************************************
 *                      FILE - DELETE ONE /api/files/:filename
 ******************************************************************************/
router.delete("/:id", async (req: Request, res: Response) => {
  try {
    const { id } = req.params as ParamsDictionary;
    if (!id) {
      return res.status(BAD_REQUEST).json({
        error: paramMissingError
      });
    }
    const [gfs, connection] = await openConnection();
    const result = await gfs.remove({
      _id: req.params.id,
      root: "uploads"
    });
    return res.status(OK).end();
  } catch (err) {
    res.status(404).json({
      err: err.message
    });
  } finally {
    logger.info("Closing MongoDB Connection");
    connection.close();
  }
});

export default router;
