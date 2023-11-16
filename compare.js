const bcrypt = require('bcrypt');

const storedHash = "$2b$10$tMd21.ZtAanfenG64mnKyucrV/IXVBShnENNxrkRBJHeAPV3VFZZW"; // Your stored hash
const candidatePassword = "adminPassword"; // The password the user entered

bcrypt.compare(candidatePassword, storedHash, function(err, result) {
    if (err) {
        console.error("Error comparing passwords:", err);
    } else {
        if (result) {
            console.log("Password is correct!");
        } else {
            console.log("Password is incorrect!");
        }
    }
});
