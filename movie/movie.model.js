import mongoose from "mongoose";

// set rule

const movieSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true,
    maxlength: 55,
  },
  rating: {
    type: Number,
    min: 0,
    max: 10,
    required: false,
    default: null,
  },
  addedBy: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: "users",
  },
});

// create table
const Movie = mongoose.model("Movie", movieSchema);

export default Movie;
