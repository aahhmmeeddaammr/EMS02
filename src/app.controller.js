import express from "express";
import userController from "./modules/user/user.controller.js";
import { checkconnection, syncDatabase } from "./db/connection.db.js";
import cors from "cors";

export const bootstrap = async () => {
  const app = express();
  app.use(cors());
  app.use(express.json());
  app.use("/uploads", express.static("uploads"));

  // db
  await checkconnection();
  await syncDatabase();
  // app-router
  app.get("api/v1/", (req, res, next) => {
    return res.json({ message: "welcome in our EMS application" });
  });
  app.use("/user", userController);
  app.all("{/*dummy}", (req, res, next) => {
    return res.status(404).json({ message: "in-valid route" });
  });
  app.listen(3000, () => {
    console.log("server running on port :: 3000");
  });
};
