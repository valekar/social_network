// import mongoose from "mongoose";
// import Grid from "gridfs-stream";
// //import logger from "morgan";
// import { paramMissingError, logger, adminMW } from "@shared";
// import express, { Router } from "express";
// import { BAD_REQUEST } from "http-status-codes";

// var Busboy = require("busboy");
// const app1 = express();

// //app1.use(busboy({ immediate: true }));
// app1.use(express.urlencoded({ extended: true }));

// const router = Router();
// app1.use("/api", router);
// /******************************************************************************
//  *                      upload a photo - "POST /api/photos/upload"
//  ******************************************************************************/
// router.post("/upload", async (req: any, res: any) => {
//   try {
//     /* const connection = mongoose.createConnection(
//       process.env.MONGOOSE_CONNECTION_URL + ""
//     );*/

//     var busby = new Busboy({ headers: req.headers });
//     busby.on(
//       "file",
//       (
//         fieldName: String,
//         file: any,
//         fileName: any,
//         encoding: any,
//         mine: any
//       ) => {
//         let part = file;
//       }
//     );

//     /* connection.once("open", () => {
//       var gridfs = Grid(connection.db, mongoose.mongo);
//       let part = req.files.file;
//       let writeStream = gridfs.createWriteStream({
//         filename: "img_" + part.name,
//         mode: "w",
//         content_type: part.mimetype
//       });

//       writeStream.on("close", (file: any) => {
//         return res.status(200).send({
//           message: "Success",
//           file: file
//         });
//       });

//       writeStream.write(part.data);
//       writeStream.end();
//       connection.close();
//     });*/
//     //return res.status(OK).end();
//   } catch (err) {
//     logger.error(err.message, err);
//     return res.status(BAD_REQUEST).json({
//       error: err.message
//     });
//   }
// });

// router.get("/test", (req: any, res: any) => {
//   res.send("Hellow");
// });

// export default app1;
