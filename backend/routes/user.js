const express = require("express");
const router = express.Router();
const User = require("../models/user");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

// Signup Route
router.post("/signup", (req, res, next) => {
  console.log("Received signup data:", req.body);
  bcrypt.hash(req.body.password, 10)
    .then(hash => {
      const newUser = new User({
        email: req.body.email,
        password: hash
      });
      return newUser.save();
    })
    .then(result => {
      console.log("User created:", result);
      res.status(201).json({
        message: "User Created",
        result: result
      });
    })
    .catch(err => {
      console.error("Signup failed:", err);
      res.status(500).json({
        error: err.message
      });
    });
});

router.post("/login", (req, res, next) => {
  User.findOne({ email: req.body.email })
    .then(user => {
      if (!user) {
        return res.status(401).json({
          message: "Auth failed (User not found)"
        });
      }
      return bcrypt.compare(req.body.password, user.password)
        .then(result => {
          if (!result) {
            return res.status(401).json({
              message: "Auth failed (Wrong password)"
            });
          }
          const token = jwt.sign(
            { email: user.email, userId: user._id },
            "A_very_long_string_for_our_secret",
            { expiresIn: "1h" }
          );
          res.status(200).json({
            message: "Auth successful",
            token: token,
            expiresIn: 3600,
            userId: user._id
          });
        });
    })
    .catch(err => {
      console.error("Login error:", err);
      res.status(500).json({
        error: "Authentication failed"
      });
    });
});

module.exports = router;