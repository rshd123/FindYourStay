const express = require("express");
const app = express();
const port = 3000;
const cookieParser = require("cookie-parser");
app.use(cookieParser("secretCode"));

app.listen(port,()=>{
    console.log("app is listening");
});

app.get("/sendsignedcookies",(req,res)=>{
    res.cookie("Greet-","Namaste",{signed:true});
    res.cookie("made-In","India",{signed:true});
    res.send("signed cookie sent");
});

app.get("/sendcookies",(req,res)=>{
    res.cookie("Greet-","Ciao");
    res.send("Cookie sent!");
})

app.get("/getSignedCookies",(req,res)=>{
    res.send(req.signedCookies);
});

app.get("/getCookies",(req,res)=>{
    res.send(req.cookies);
});

app.get("/",(req,res)=>{
    res.send("this is root");
});


