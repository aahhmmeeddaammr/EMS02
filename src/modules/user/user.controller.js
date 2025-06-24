import { Router } from "express";
import * as userService from "./user.service.js";
import { upload } from "../../utils/uploadimage.util.js";

const router = Router();

router.post("/", upload.single("image"), userService.createUser);

router.get("/", userService.getAllUsers);

router.get("/:id", userService.getUserById);

router.delete("/:id", userService.deleteUser);

router.put("/:id", upload.single("image"), userService.updateUser);

export default router;
