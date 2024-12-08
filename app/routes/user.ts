import {
  login_user_validation,
  register_user_validation,
} from "../validators/user";
import { all_users } from "../controllers/user/all_users";
import { Router } from "express";
import { register_user } from "../controllers/user/register_user";
import { login_user } from "../controllers/user/login_user";
import { auth } from "../middleware/auth";

const router = Router();

router.get("/all-users", auth, all_users);
router.post("/register-user", register_user_validation, register_user);
router.post("/login-user", login_user_validation, login_user);
export default router;
