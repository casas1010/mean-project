const path = require("path");
const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");

const jobsRoutes = require("./routes/jobs");
const postsRoutes = require("./routes/posts");
const userRoutes = require("./routes/user");
const { error } = require("console");

const app = express();

mongoose
  .connect(
    "mongodb+srv://casas1010:" +process.env.MONGO_ATLAS_PW +"@cluster0.teliend.mongodb.net/?retryWrites=true&w=majority"
  )
  .then(() => {
    console.log("Connected to database!");
  })
  .catch((err) => {
    console.log("Connection failed!: "+ JSON.stringify(err));
  });

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use("/images", express.static(path.join("backend/images")));

app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept, Authorization"
  );
  res.setHeader(
    "Access-Control-Allow-Methods",
    "GET, POST, PATCH, PUT, DELETE, OPTIONS"
  );
  next();
});

app.use( (req,res,next)=>{
  var fullUrl = req.protocol + '://' + req.get('host') + req.originalUrl;
  console.log('url being requested:  '+fullUrl);
  next();
})


app.use("/api/jobs", jobsRoutes);
app.use("/api/posts", postsRoutes);
app.use("/api/user", userRoutes);

module.exports = app;
