const router = require('express').Router();
const bcryptjs = require("bcryptjs");
const jwt = require('jsonwebtoken');

const Users = require("../users/users-model.js");
const { isValid } = require("../users/users-service.js");

const { jwtSecret } = require('./secrets.js');


router.post('/register', (req, res) => {
  // implement registration
  const credentials = req.body

  if(isValid(credentials)){
    const hash = bcryptjs.hashSync(credentials.password, 8);
    credentials.password = hash;
  
    Users.add(credentials)
    .then(data => {
      res.status(201).json(data)
    })
    .catch(error => {
      res.status(500).json({ message: error.message });
    })

  }else{
    res.status(400).json({
      message: "credentials are invalid",
    });
  }
});

router.post('/login', (req, res) => {
  // implement login
  const { username, password } = req.body;

  if (isValid(req.body)) {
    Users.findBy({ username: username })
      .then(([user]) => {
        if (user && bcryptjs.compareSync(password, user.password)) {
          const token = makeToken(user) 
          res.status(200).json({ message: "Welcome to our API", token });
          res.status(401).json({ message: "Invalid credentials" });
        }
      })
      .catch(error => {
        res.status(500).json({ message: error.message });
      });
  } else {
    res.status(400).json({
      message: "credentials are invalid",
    });
  }
});

function makeToken(user) {
  const payload = {
    subject: user.id,
    username: user.username,
  };
  const options = {
    expiresIn: '90 seconds',
  };
  return jwt.sign(payload, jwtSecret, options);
}

module.exports = router;
