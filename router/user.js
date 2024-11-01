const express = require("express");
const router = express.Router();
// const User = require("../Models/user.js");
// const wrapAsync = require("../utils/wrapAsync.js");
const passport = require("passport");
const {saveRedirectURL} = require("../middleware.js");
const userController = require("../controllers/user.js");


router.get("/signup", userController.signUp);

router.post("/signup", userController.saveNewUser);

router.get("/login", userController.renderLoginForm);


//passport.authenticate() is a middleware used to authenticate the user before login

router.post("/login",saveRedirectURL,passport.authenticate("local",{
        failureRedirect: "/login",
        failureFlash:true,
    }), userController.Login
);

router.get("/logout", userController.Logout);

module.exports = router;