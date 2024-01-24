import express from "express";
import { userSchema } from "./user.validation.js";
import User from "./user.model.js";
import * as bcrypt from "bcrypt";

const router = express.Router();

// register user
router.post(
  "/user/register",
  async (req, res, next) => {
    // extract new user from req.body
    const newUser = req.body;

    try {
      // validate new user
      const validatedData = await userSchema.validate(newUser);

      req.body = validatedData;

      // call next function
      next();
    } catch (error) {
      // if validation fail, throw error
      return res.status(400).send({ message: error.message });
    }
  },
  async (req, res) => {
    // extract user from req.body
    const newUser = req.body;

    // ?check if user with email already exists

    // find user
    const user = await User.findOne({ email: newUser.email });

    // if user, throw error
    if (user) {
      return res.status(409).send({ message: "Email already exists." });
    }

    // hash password

    let saltRound = 10;

    const hashedPassword = await bcrypt.hash(newUser.password, saltRound);

    newUser.password = hashedPassword;

    // create user
    await User.create(newUser);

    return res
      .status(201)
      .send({ message: "User is registered successfully." });
  }
);
export default router;
