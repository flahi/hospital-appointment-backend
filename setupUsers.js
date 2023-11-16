const bcrypt = require('bcrypt');
const mongoose = require('mongoose');
const User = require('./model/userModel');

const users = [
  {
    empId: 100, // Example empId for 'doctor'
    password: bcrypt.hashSync('doctorPassword', 10),
    role: 'doctor',
  },
  {
    empId: 1, // Example empId for 'admin'
    password: bcrypt.hashSync('adminPassword', 10),
    role: 'admin',
  },
];

mongoose.connect('mongodb+srv://admin:12345@cluster0.mmfpfzc.mongodb.net/Sunrise', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

const insertUsers = async () => {
  for (const user of users) {
    try {
      const existingUser = await User.findOne({ empId: user.empId });

      if (!existingUser) {
        const newUser = new User(user);
        await newUser.save();
        console.log(`User ${user.empId} added to the database.`);
      } else {
        console.log(`User ${user.empId} already exists in the database.`);
      }
    } catch (error) {
      console.error(`Error adding user ${user.empId}: ${error.message}`);
    }
  }

  mongoose.connection.close();
};

insertUsers();
