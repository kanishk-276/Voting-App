const express = require("express");
const router = express.Router();
const User = require("./../user.js");
const { jAuthmiddleware, generateToken } = require("./../jwt");

router.get("/profile", jAuthmiddleware, async (req, res) => {
  try {
    const userData = req.user;
    const userId = userData.id;
    const user = await User.findById(userId);
  } catch (err) {
    console.log(err);
    res.status(500).json(response);
  }
});

router.put("/profile/password", jAuthmiddleware, async (req, res) => {
  try {
    const userId = req.user; // Extract the id from the token
    const { currentPassword, newPassword } = req.body;
    const user = await User.findById(userId);

    if (!(await user.comparePassword(password))) {
      return res
        .status(401)
        .json({ error: "invalid adhaarCardNumber or password" });

      user.password = newPassword;
      await user.save();

      console.log("password updated");
      res.status(200).json({ message: "password has been updated!" });
    }
  } catch (err) {
    console.log(err);

    res.status(500).json({ error: "Internal Server Error" });
  }
});

router.get("/", jAuthmiddleware, async (req, res) => {
  try {
    const data = await User.find();
    console.log("data fetched");
    res.status(200).json(data);
  } catch (err) {
    console.log(err);
    res.status(500).json(response);
  }
});

// login route

router.post("/login", async (req, res) => {
  try {
    const { adhaarCardNumber, password } = req.body;
    const user = await User.findOne({ adhaarCardNumber: adhaarCardNumber });
    if (!user || !(await user.comparePassword(password))) {
      return res
        .status(401)
        .json({ error: "invalid adhaarCardNumber or password" });
    }

    const payload = {
      id: user.id,
    };
    const token = generateToken(payload);
    res.json({ token });
  } catch (err) {
    console.log(err);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

// signup route

router.post("/signup", async (req, res) => {
  try {
    const data = req.body;
    const newUser = new User(data);
    const response = await newUser.save();
    console.log("data saved");
    const payload = {
      id: response.id,
    };
    console.log(JSON.stringify(payload));
    const token = generateToken(payload);
    console.log("Generated Token: ", token);
    res.status(200).json({ response: response, token: token });
  } catch (err) {
    console.log(err);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

module.exports = router;
