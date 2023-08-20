const express = require("express");
const router = express.Router();
// const { Users } = require("../models");
const { sign } = require("jsonwebtoken");
const Users = require("../models/Users");

router.post("/register", async (req, res) => {
  const { name, email, password } = req.body;
  const authorizedUser = await Users.findOne({
    where: {
      email: email,
    },
  });
  if (authorizedUser) {
    res.json({ error: "This email is already registered." });
  } else {
    const user = await Users.create({
      name: name,
      email: email,
      password: password,
      loginTime: new Date(),
    });
    const accessToken = sign(
      {
        email: email,
        id: user.id,
      },
      "secret"
    );
    res.json(accessToken);
  }
});

router.post("/login", async (req, res) => {
  const { email, password } = req.body;
  const user = await Users.findOne({
    where: {
      email: email,
    },
  });

  // if user exists
  if (user) {
    if (user.blocked === true) {
      res.json({ error: "Sorry, you cannot login. You're blocked." });
    } else if (password !== user.password) {
      res.json({ error: "Wrong password. Please. try again!" });
    }
  } else if (!user) {
    // if not
    res.json({ error: "Email is not authenticated. Please, sign up!" });
  }

  if (user && password === user.password) {
    await Users.update(
      {
        loginTime: new Date(),
      },
      {
        where: {
          email: email
        },
      }
    );
    const accessToken = sign(
      {
        email: email,
        id: user.id,
      },
      "secret"
    );
    res.json(accessToken);
  }
});

router.get("/users", async (req, res) => {
  const users = await Users.findAll();
  res.json(users);
});

router.post("/delete", async (req, res) => {
  try {
    await Users.destroy({ where: { id: req.body } });

    // Respond with success message
    res.json("Users deleted successfully.");
  } catch (error) {
    // Handle error
    res.json({ error: "An error occurred while deleting users." });
  }
});

router.post("/block", async (req, res) => {
  const keys = req.body;

  try {
    await Users.update(
      {
        blocked: true,
      },
      {
        where: {
          id: keys,
        },
      }
    );
    res.json("Users are blocked successfully");
  } catch (er) {
    res.json({ error: "An error occurred while blocking users." });
  }
});

router.post("/unblock", async (req, res) => {
  const keys = req.body;
  try {
    await Users.update(
      {
        blocked: false,
      },
      {
        where: {
          id: keys,
        },
      }
    );
    res.json("Users are unblocked successfully");
  } catch (er) {
    res.json({ error: "An error occured while unblocking users" });
  }
});

module.exports = router;
