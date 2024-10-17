const express = require("express");
const app = express();
const port = 3000;
const mongoose = require("mongoose");
const path = require("path");
const override = require("method-override");
const ejsMate = require("ejs-mate");
const Listing = require("./router/Listing.js"); 
const reviews = require("./router/review.js");
const expressError = require("./utils/expressError.js");
const session = require("express-session");
const flash = require("connect-flash");

app.set("view engine","ejs");
app.set("views",path.join(__dirname,"views"));

app.use(express.static(path.join(__dirname,"public")));
app.use(express.urlencoded({extended:true}));
app.use(override("_method"));
app.engine("ejs",ejsMate);

// main().catch(err => console.log(err));

async function main() {
  await mongoose.connect('mongodb://127.0.0.1:27017/wanderlust');

}
main()
    .then(()=>{
        console.log("connected to DB");
    })
    .catch((err)=>{
        console.log(err);
    });


app.listen(port,()=>{
    console.log("app is listening");
});

const sessionOptions = {
    secret:"mysecretcode",
    resave:false,
    saveUninitialized:true,
    cookie:{
        expires:Date.now()+ 7*24*60*60*1000,
        maxAge:7*24*60*60*1000,
        httpOnly:true,
    },
};

app.get("/",(req,res)=>{
    res.send("hi root is working");
});

app.use(session(sessionOptions));
app.use(flash());
app.use((req,res,next)=>{
    res.locals.success=req.flash("success"); //name-value pair stored in Listing.js in line 40, it is an array
    next();
});

app.use("/listings",Listing);
app.use("/listings/:id/reviews",reviews);



app.all("*",(req,res,next)=>{
    next(new expressError(404,"Page not found !"));
});

app.use((err,req,res,next)=>{
    let {statusCode=500,message="Some Error occured"} = err;
    // res.status(statusCode).send(message);
    res.render("error.ejs",{err});
    next(); 
})
