const bcrypt = require("bcrypt");
const user = require("../models/user");
const userSchema = require("../schema/userSchema");
const jwt = require("jsonwebtoken");
const saltRounds = 10;

const generateAuthToken = () => {
  return jwt.sign({ _id: this._id }, process.env.JWT_SECRET, {
    expiresIn: "7d",
  });
};

const isExistingUser = async (username) => {
  return await user.findOne({ username });
};

exports.register = async (req, res) => {
  const { username, email, password, phoneNumber } = req.body;

  const userData = { username, email, password, phoneNumber };

  const { error } = userSchema.validate(userData);
  if (error) {
    return res.status(400).send(error.details[0].message);
  }

  const userExists = await isExistingUser(username);
  if (userExists) {
    return res.send("User already exists");
  }

  const hashedPassword = await bcrypt.hash(password, saltRounds);

  try {
    await user.create({ ...userData, password: hashedPassword });
    res.status(201).send(`Congrats ${username} your account has been created`);
  } catch (err) {
    if (err.code === 11000) {
      // Duplicate key error
      const field = Object.keys(err.keyPattern)[0];
      return res.status(400).json({ error: `${field} already exists.` });
    }
    res.status(500).send("Something went wrong");
  }
};

exports.login = async (req, res) => {
  const { username, password } = req.body;

  if (!username || !password) {
    return res.status(400).send("Please provide username and password");
  }

  try {
    const userExists = await isExistingUser(username);

    if (!userExists) {
      return res.status(401).send("User does not exist");
    }

    const validPassword = await bcrypt.compare(password, userExists.password);

    if (!validPassword) {
      return res.status(401).send("Wrong credentials");
    }

    const token = generateAuthToken();
    res.send(token);
  } catch (error) {
    res.status(500).send(error);
  }
};
