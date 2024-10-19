const express = require("express");
const router = express.Router();
const User = require("../Models/user.js");
const wrapAsync = require("../utils/wrapAsync.js");
const passport = require("passport");
router.get("/signup", (req, res) => {
    res.render("./users/signup.ejs");
});

router.post("/signup", wrapAsync(async (req, res) => {
    try {
        let { email, username, password } = req.body
        const newUser = new User({ email, username });
        const registeredUser = await User.register(newUser, password);
        console.log(registeredUser);
        req.flash("success", "Welcome to Wanderlust! ");
        res.redirect("/listings");
    } catch (e) {
        req.flash("success", e.message);
        res.redirect("/signup");
    }
}));

router.get("/login", (req, res) => {
    res.render("./users/login.ejs");
});


//passport.authenticate() is a middleware used to authenticate the user before login

router.post("/login", passport.authenticate("local",{
        failureRedirect: "/login",
        failureFlash:true,
    }), async (req, res) => {
        req.flash("success","Welcome back to Wanderlust !");
        res.redirect("/listings");
});

module.exports = router;