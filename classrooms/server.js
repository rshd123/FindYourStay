const express = require("express");
const app = express();
const port = 3000;
// const cookieParser = require("cookie-parser");
const session = require("express-session");
const flash = require("connect-flash");
const path = require("path");

// app.use(cookieParser("secretCode"));

app.listen(port, () => {
    console.log("app is listening");
});

// app.get("/sendsignedcookies",(req,res)=>{
//     res.cookie("Greet-","Namaste",{signed:true});
//     res.cookie("made-In","India",{signed:true});
//     res.send("signed cookie sent");
// });

// app.get("/sendcookies",(req,res)=>{
//     res.cookie("Greet-","Ciao");
//     res.send("Cookie sent!");
// })

// app.get("/getSignedCookies",(req,res)=>{
//     res.send(req.signedCookies);
// });

// app.get("/getCookies",(req,res)=>{
//     res.send(req.cookies);
// });

// app.get("/",(req,res)=>{
//     res.send("this is root");
// });

app.set("view engine","ejs");
app.set("views",path.join(__dirname,"views"));

app.use(session({ 
    secret: "This is my secretString",
    resave:false,
    saveUninitialized:true,
}));
// app.use(session(sessionOptions));
app.use(flash()); 
app.use((req,res,next)=>{
    res.locals.success = req.flash("success");
    res.locals.err = req.flash("err");
    next(); 
});


app.get("/reqcount",(req,res)=>{
    if(req.session.count){
        req.session.count++;
    }else{
        req.session.count = 1;
    }
    res.send(`You sent the request ${req.session.count} times`);
});

app.get("/register",(req,res)=>{
    let {name="Anonymous"} = req.query;
    req.session.name = name;
    if(name=="Anonymous"){
        req.flash("err","User not registered");
    }else{
        req.flash("success","user registered successfully");
    }
    
    res.redirect("/hello");
});

app.get("/hello",(req,res)=>{
    res.render("show.ejs",{name:req.session.name});
});

app.get("/test", (req, res) => {
    res.send("This is Test Route");
});
