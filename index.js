import express from "express";
import connectDB from "./db.connect.js";
import userRoutes from "./user/user.route.js";

const app = express();
// to make app understand json
app.use(express.json());

// connect database
connectDB();

// register routes
app.use(userRoutes);

// network port allocation
const PORT = 4000;

app.listen(PORT, () => {
  console.log(`App is listening on port ${PORT}`);
});
