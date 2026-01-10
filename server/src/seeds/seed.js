import dotenv from "dotenv";
import mongoose from "mongoose";
import Exercise from "../models/Exercise.js";
import Progress from "../models/Progress.js";
import Workout from "../models/Workout.js";
import WorkoutLog from "../models/WorkoutLog.js";
import User from "../models/User.js";

dotenv.config();

const runSeed = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);

    await Exercise.createCollection();
    await Progress.createCollection();
    await User.createCollection();
    await Workout.createCollection();
    await WorkoutLog.createCollection();

    console.log("Toutes les collections ont été créées.");
  } catch (err) {
    console.error("Erreur seed :", err.message);
  } finally {
    await mongoose.disconnect();
    process.exit(0);
  }
};

runSeed();