const express = require('express');
const app = express();
const { User } = require('./db');
var bcrypt = require('bcryptjs');

app.use(express.json());
app.use(express.urlencoded({extended:true}));

app.get('/', async (req, res, next) => {
  try {
    res.send('<h1>Welcome to Loginopolis!</h1><p>Log in via POST /login or register via POST /register</p>');
  } catch (error) {
    console.error(error);
    next(error)
  }
});

// POST /register
// TODO - takes req.body of {username, password} and creates a new user with the hashed password
app .post("/register", async(req, res, next) =>{
  const SALT_Length = 10;
  const {username, password} = req.body;

  try {
    const hash = await bcrypt.hash(password, SALT_Length);
    const user  = await User.create({username, password: hash});
    res.send(`successfully created user ${username}`)
  }
  catch (err){
    next(err);
    res.status(500).send(err.toString());
  }
}
)

// POST /login
// TODO - takes req.body of {username, password}, finds user by username, and compares the password with the hashed version from the DB
app .post("/login", async(req, res, next) =>{
  const {username, password} = req.body;
  
  try {
  const user = await User.findOne({where: {username}})
  if (user){
    const matches = await bcrypt.compare(password, user.password);
    if (matches){
      res.send(`successfully logged in user ${username}`);
    } else {
      res.status(401).send("incorrect username or password");
    }
   } else {
    res.status(404).send("invalid username");
  } 
} catch (err) {
  next(err);
  res.status(500).send(err.toString());
}
}
)
// we export the app, not listening in here, so that we can run tests
module.exports = app;
