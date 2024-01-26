import express from "express";
import { isUser } from "../middleware/authentication.middleware.js";
import Movie from "./movie.model.js";
import { movieSchema } from "./movie.validation.js";
import mongoose from "mongoose";

const router = express.Router();

// add movie
router.post(
  "/movie/add",
  isUser,
  async (req, res, next) => {
    const newMovie = req.body;

    try {
      const validatedData = await movieSchema.validate(newMovie);

      req.body = validatedData;

      next();
    } catch (error) {
      return res.status(400).send({ message: error.message });
    }
  },
  async (req, res) => {
    const newMovie = req.body;

    newMovie.addedBy = req.userId;

    // create movie
    await Movie.create(newMovie);

    return res.status(201).send({ message: "Movie is added successfully." });
  }
);

// get movie details
router.get(
  "/movie/details/:id",
  isUser,
  (req, res, next) => {
    // extract id from req.params
    const id = req.params.id;

    // check for mongo id validity
    const isValidMongoId = mongoose.Types.ObjectId.isValid(id);

    // if not valid, throw error
    if (!isValidMongoId) {
      return res.status(400).send({ message: "Invalid mongo id." });
    }

    // call next function
    next();
  },
  async (req, res) => {
    const movieId = req.params.id;

    const movie = await Movie.findOne({ _id: movieId });

    if (!movie) {
      return res.status(404).send({ message: "Movie does not exist." });
    }

    return res.status(200).send({ message: "success", movie: movie });
  }
);

export default router;
