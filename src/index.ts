import "./LoadEnv"; // Must be the first import
import app from "@server";
import { logger } from "@shared";
import mongoose from "mongoose";
// Start the server
const port = Number(process.env.PORT || 3000);

mongoose
  .connect("mongodb://localhost:27017/typescriptDB")
  .then(result => {
    app.listen(port, () => {
      logger.info("Express server started on port: " + port);
    });
  })
  .catch(err => {
    // tslint:disable-next-line: no-console
    console.log(err);
  });
