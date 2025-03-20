import mongoose from "mongoose";
import dotenv from "dotenv";
import express from "express";
import contactRoutes from "./routes/contact.js";

dotenv.config();

const app = express();
app.use(express.json());

mongoose
  .connect(process.env.MONGODB_URI)
  .then(() => console.log("Connected to MongoDB"))
  .catch((err) => console.error("MongoDB connection error:", err));

app.use("/", contactRoutes);

const PORT = process.env.PORT || 3000;

// Only start the server if this file is run directly
if (process.env.NODE_ENV !== "test") {
  const PORT = process.env.PORT || 3000;
  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });
}

export default app;
