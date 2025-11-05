const dotenv = require("dotenv");
dotenv.config();

const User = require("../models/user");
const jwt = require("jsonwebtoken");
const { SECRET_JWT } = process.env;

const loginUser = async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email });

    if (!user) {
      return res.status(404).json({ message: "Usuario no encontrado" });
    }

    if (user.password !== password) {
      return res.status(401).json({ message: "Contraseña incorrecta" });
    }

    const token = jwt.sign(
      { email: user.email, password: user.password },
      SECRET_JWT,
      { expiresIn: '1h' }
    );

    res.status(200).json({
      message: "Login exitoso",
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        age: user.age,
        gender: user.gender,
        profilePhoto: user.profilePhoto,
        interests: user.interests,
        bio: user.bio,
        swipes: user.swipes,
        matches: user.matches,
      },
    });
  } catch (error) {
    res.status(500).json({ message: "Error del servidor", error });
  }
};

const registerUser = async (req, res) => {
  const { name, email, password, age, gender } = req.body;

  try {
    const existingUser = await User.findOne({ email });

    if (existingUser) {
      return res.status(400).json({ message: "El usuario ya está registrado" });
    }

    const newUser = new User({
      name,
      email,
      password,
      age,
      gender,
    });

    await newUser.save();

    const token = jwt.sign(
      { email: newUser.email, password: newUser.password },
      SECRET_JWT,
      { expiresIn: "1h" }
    );

    res.status(201).json({
      message: "Registro exitoso",
      token,
      user: {
        id: newUser._id,
        name: newUser.name,
        email: newUser.email,
        age: newUser.age,
        gender: newUser.gender,
      },
    });
  } catch (error) {
    res.status(500).json({ message: "Error del servidor" });
  }
};

module.exports = {
  loginUser,
  registerUser,
};
