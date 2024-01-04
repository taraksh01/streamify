import dotenv from "dotenv";
import connectDB from "./db/index.js";

dotenv.config({ path: ".env" });

connectDB()
  .then(
    app.on("error", (error) => {
      console.log(error);
      throw error;
    }),

    app.listen(process.env.PORT, () =>
      console.log(`Server running on port ${process.env.PORT}`),
    ),
  )
  .catch((error) => {
    console.error(`MongoDb connection failed: ${error.message}`);
    process.exit(1);
  });
