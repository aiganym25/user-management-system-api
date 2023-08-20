const express = require("express");
const app = express();
const cors = require("cors");
const port = 3002;
const db = require("./models");
const connection = require ("./models/index.js");



app.use(express.json());
app.use(cors());

//ROUTERS
const usersRouter = require("./routes/Users");
app.use("/", usersRouter);


// connection.sync().then(() => {
//   app.listen(process.env.PORT || port, () => {
//     console.log(`server is running ${port}`);
//   });
// });

app.listen(process.env.PORT || port, async () => {
  console.log("server has started");
  try {
    await connection.authenticate();
    connection.sync();
    console.log("Connection has been established successfully.");
  } catch (error) {
    console.error("Unable to connect to the database:", error);
  }
});
