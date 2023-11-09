const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const User = require("../model/userModel");

const secretKey = "your-secret-key"; // Replace with your secret key

function loginUser(req, res) {
  const { email, password } = req.body;
  User.findOne({ email })
    .then((user) => {
      if (!user) {
        return res.status(401).json({ message: "User not found" });
      }

      if (bcrypt.compareSync(password, user.password)) {
        const token = jwt.sign({ email, role: user.role }, secretKey, {
          expiresIn: "1h",
        });
        return res.status(200).json({ token, role: user.role });
      } else {
        return res.status(401).json({ message: "Invalid password" });
      }
    })
    .catch((error) => {
      return res.status(500).json({ message: "An error occurred" });
    });
}

function authenticateUser(req, res, next) {
  const token = req.headers.authorization;

  if (!token) {
    return res.status(401).json({ message: "Unauthorized" });
  }

  jwt.verify(token, secretKey, (err, decoded) => {
    if (err) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    // Make user info available to your route handlers
    req.user = decoded;
    next();
  });
}

module.exports = {
  loginUser,
  authenticateUser,
};
