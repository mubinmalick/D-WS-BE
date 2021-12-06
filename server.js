const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const path = require('path')

const app = express();
app.use(express.json());
app.use(express.urlencoded());
app.use(cors());

/////////////////////////////////////////////////////////////////////////////////
//Database
//DB connection
mongoose.connect(
  "mongodb+srv://mubinmalick123:malick123@cluster0.svpcu.mongodb.net/dynamicWebScraperDB?authSource=admin&replicaSet=atlas-3jo66t-shard-0&readPreference=primary&appname=MongoDB%20Compass&ssl=true",
  {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  },
  () => {
    console.log("DB connceted");
  }
);
// DB schema
const userSchema = new mongoose.Schema({
  name: String,
  email: String,
  password: String,
});
//DB model
const User = new mongoose.model("User", userSchema);
/////////////////////////////////////////////////////////////////////////////////

/////////////////////////////////////////////////////////////////////////////////
// Routes
app.get("/", (req, res) => {
  //res.send("My Scraper Api");
  res.sendFile(path.join(__dirname, 'views/index.html'))
});

app.post("/login", (req, res) => {
  const { email, password } = req.body;
  User.findOne({ email: email }, (err, user) => {
    if (user) {
      if (password === user.password) {
        res.send({
          message: "Login successfully",
          user: user,
        });
      } else {
        res.send({
          message: "Password incorrect",
        });
      }
    } else {
      res.send({
        message: "user not registered",
      });
    }
  });
});

app.post("/register", (req, res) => {
  const { name, email, password } = req.body;
  User.findOne({ email: email }, (err, user) => {
    if (user) {
      res.send({
        message: "User already registered",
      });
    } else {
      const user = new User({
        name,
        email,
        password,
      });
      user.save((err) => {
        if (err) {
          res.send(err);
        } else {
          res.send({
            message: "Successfully Registered, Please login now",
          });
        }
      });
    }
  });
});


/////////////////////////////////////////////////////////////////////////////////
app.listen(9002, () => {
  console.log("Backend started at port 9002");
});
