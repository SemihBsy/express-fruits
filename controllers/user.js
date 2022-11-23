////////////////////////////////////////
// Import Dependencies
////////////////////////////////////////
const express = require("express");
const User = require("../models/user");
const bcrypt = require("bcryptjs");


/////////////////////////////////////////
// Create Route
/////////////////////////////////////////
const router = express.Router();

/////////////////////////////////////////
// Routes
/////////////////////////////////////////

// The Signup Routes (Get => form, post => submit form)
router.get("/signup", (req, res) => {
res.render("user/signup.ejs");
});

router.post("/signup", async (req, res) => {
  // encrypt password
req.body.password = await bcrypt.hash(
    req.body.password,
    await bcrypt.genSalt(10)
);
  // create the new user
User.create(req.body, (err, user) => {
    //redirect to login page
    res.redirect("/user/login");
});
});

// The login Routes (Get => form, post => submit form)
router.get("/login", (req, res) => {
res.render("user/login.ejs");
});

router.post("/login", (req, res) => {
  // get username and password
const { username, password } = req.body;
  // check if user exists
User.findOne({ username }, async (err, user) => {
    // handle if user doesn't exist
    if (err) res.send("user doesn't exist");
    // compare passwords
    const result = await bcrypt.compare(password, user.password);
    // check is match was a success
    if (!result) res.send("wrong password");
    // save login info in sessions
    req.session.loggedIn = true
    req.session.username = username
    // redirect to fruits page
    res.redirect("/fruits");
});
});

router.get("/logout", (req, res) => {
    req.session.destroy((err) => {
        res.redirect("/")
    })
})

//////////////////////////////////////////
// Export the Router
//////////////////////////////////////////
module.exports = router;