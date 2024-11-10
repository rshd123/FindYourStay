const express = require("express");
const router = express.Router();
const passport = require("passport");
const {saveRedirectURL} = require("../middleware.js");
const userController = require("../controllers/user.js");


router.route("/signup")
    .get(userController.signUp)
    .post(userController.saveNewUser);

router.route("/login")
    //passport.authenticate() is a middleware used to authenticate the user before login
    .get(userController.renderLoginForm)
    .post(saveRedirectURL,passport.authenticate("local",{
        failureRedirect: "/login",
        failureFlash:true,
    }), userController.Login
    );


router.route("/logout")
    .get(userController.Logout);

module.exports = router;