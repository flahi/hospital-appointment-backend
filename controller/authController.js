const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const User = require("../model/userModel");

const secretKey = "your-secret-key"; // Replace with your secret key

function loginUser(req, res) {
  const { empId, password } = req.body;
  User.findOne({ empId })
    .then((user) => {
      if (!user) {
        return res.status(401).json({ message: "User not found" });
      }

      if (bcrypt.compareSync(password, user.password)) {
        const token = jwt.sign({ empId, role: user.role }, secretKey, {
          expiresIn: "1h",
        });
        return res.status(200).json({ token, role: user.role });
      } else {
        return res.status(402).json({ message: "Invalid password" });
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

function handleUnauthorized(req, res) {
  return res.redirect('/error'); // Redirect unauthorized users to error route
}

function changeDoctorPassword(req, res) {
  const { empId, newPassword } = req.body;

  // Retrieve the token from the request header
  const token = req.headers.authorization;

  // Verify the token
  jwt.verify(token, secretKey, (err, decoded) => {
    if (err) {
      console.error('Token verification error:', err);
      return res.status(401).json({ message: "Unauthorized" });
    }

    // Check if the user ID from the token matches the requested user ID and role is 'doctor'
    if (decoded.empId !== empId || decoded.role !== 'doctor') {
      return res.status(401).json({ message: "Unauthorized access to change password" });
    }

    // Find the user by empId in the database
    User.findOne({ empId })
      .then((user) => {
        if (!user) {
          return res.status(404).json({ message: "User not found" });
        }

        // Hash the new password before updating in the database
        const hashedPassword = bcrypt.hashSync(newPassword, 10);


        // Update the user's password with the new hashed password
        user.password = hashedPassword;

        // Save the updated user object
        user.save()
          .then(() => {
            return res.status(200).json({ message: "Password updated successfully" });
          })
          .catch((error) => {
            console.error('Error updating password:', error);
            return res.status(500).json({ message: "Error updating password", error });
          });
      })
      .catch((error) => {
        console.error('Database error:', error);
        return res.status(500).json({ message: "An error occurred", error });
      });
  });
}

module.exports = {
  loginUser,
  authenticateUser,
  handleUnauthorized,
  changeDoctorPassword, // Include the changeDoctorPassword function in the module exports
};
