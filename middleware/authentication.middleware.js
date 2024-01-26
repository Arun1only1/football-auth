import jwt from "jsonwebtoken";
import User from "../user/user.model.js";

export const isUser = async (req, res, next) => {
  // extract token from req headers
  const authorization = req.headers.authorization;

  const splittedValue = authorization?.split(" ");

  const token = splittedValue?.length === 2 ? splittedValue[1] : null;

  // if not token
  if (!token) {
    return res.status(401).send({ message: "Unauthorized." });
  }

  // verify token
  let payload;
  try {
    payload = jwt.verify(token, "abc@3456");
  } catch (error) {
    return res.status(401).send({ message: "Unauthorized." });
  }

  // find user using email from payload
  const user = await User.findOne({ email: payload.email });

  // if not user, throw error
  if (!user) {
    return res.status(401).send({ message: "Unauthorized." });
  }

  req.userId = user._id;
  next();
};
