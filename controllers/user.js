const User = require("../Models/user.js");

module.exports.signUp = (req, res) => {
    res.render("./users/signup.ejs");
}

module.exports.saveNewUser = async (req, res) => {
    try {
        let { email, username, password } = req.body
        const newUser = new User({ email, username });
        const registeredUser = await User.register(newUser, password);
        // console.log(registeredUser);
        req.login(registeredUser, (err) => {
            if (err) {
                return next(err);
            }
            req.flash("success", "Welcome to WanderLust !");
            return res.redirect("/listings");
        });
        // req.flash("success", "Welcome to Wanderlust! ");
        // res.redirect("/listings");
    } catch (e) {
        req.flash("error", e.message);
        res.redirect("/signup");
    }
};

module.exports.renderLoginForm = (req, res) => {
    res.render("./users/login.ejs");
};

module.exports.Login = async (req, res) => {
    req.flash("success","Welcome back to Wanderlust !");
    let URL = res.locals.redirectUrl || "/listings";
    res.redirect(URL);
};

module.exports.Logout = (req,res,next)=>{
    req.logout((err)=>{
        if(err){
            return next(err);
        }
        req.flash("success","You have been logged out!");
        res.redirect("/listings");
    });
};