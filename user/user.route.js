import express from "express";
import { loginUserSchema, userRegisterSchema } from "./user.validation.js";
import User from "./user.model.js";
import * as bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

const router = express.Router();

// register user
router.post(
  "/user/register",
  async (req, res, next) => {
    // extract new user from req.body
    const newUser = req.body;

    try {
      // validate new user
      const validatedData = await userRegisterSchema.validate(newUser);

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

// login

router.post(
  "/user/login",
  async (req, res, next) => {
    // extract login credentials from req.body
    const loginCredentials = req.body;
    // validate
    try {
      const validatedData = await loginUserSchema.validate(loginCredentials);

      req.body = validatedData;

      // call next function
      next();
    } catch (error) {
      // throw error

      return res.status(400).send({ message: error.message });
    }
  },
  async (req, res) => {
    // extract login credentials from req.body
    const loginCredentials = req.body;

    // find user by email
    const user = await User.findOne({ email: loginCredentials.email });

    // if not user, throw error
    if (!user) {
      return res.status(404).send({ message: "Invalid credentials." });
    }

    // check for password match(bcrypt)
    const isPasswordMatch = await bcrypt.compare(
      loginCredentials.password,
      user.password
    );

    // if not password match, throw error
    if (!isPasswordMatch) {
      return res.status(404).send({ message: "Invalid credentials." });
    }

    // generate token
    const token = jwt.sign({ email: user.email }, "abc@3456");

    // hide password from user
    user.password = undefined;
    // send response

    return res
      .status(200)
      .send({ message: "logged in", token: token, user: user });
  }
);
export default router;
