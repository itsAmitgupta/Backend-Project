// require('dotenv').config({path:'./env'})
import dotenv from "dotenv";
import connectDb from "./db/connect.js";
import { app } from "./app.js";

dotenv.config({
  path: "./.env",
});
connectDb()
  .then(() => {
    app.listen(process.env.PORT || 8000, () => {
      console.log(`Database Connected on port ${process.env.PORT}`);
    });
  })
  .catch((err) => {
    console.log(`Database Connection error`, err);
  });
