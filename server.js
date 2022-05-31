require('dotenv').config();

const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const mongoose = require("mongoose");
const session = require('express-session')
const passport=require('passport')
const bcrypt = require('bcrypt');


const GoogleStrategy = require('passport-google-oauth20').Strategy;
const app = express();

const swaggerUi = require('swagger-ui-express');
swaggerDocument = require('./swagger.json');
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));

app.use(bodyParser.urlencoded({extended: true}));

let port  = process.env.PORT;
if(port == null || port == ""){
    port= 3000;
}

app.set('view engine', 'ejs')
app.use(express.static('public'))

app.use(session({
    secret: "Secret",
    resave: false,
    saveUninitialized: false
}))

app.use(passport.initialize())
app.use(passport.session())

app.use("/", require("./routes/root"));
app.use("/register", require("./routes/register"));
app.use("login", require("./routes/login"));
app.use("/tours", require("./routes/tours"));
app.use("/service", require("./routes/service"));
app.use("/contacts", require("./routes/contacts"));
app.use("/first_pizza",require("./routes/first_pizza"));
app.use("/second_pizza",require("./routes/second_pizza"));
app.use("/buy",require("./routes/buy"));
app.use("/third_pizza",require("./routes/third_pizza"));
app.use("/fourth_pizza",require("./routes/fourth_pizza"));
app.use("/fifth_pizza",require("./routes/fifth_pizza"));
app.use("/sixth_pizza",require("./routes/sixth_pizza"));
app.use("/sale",require("./routes/sale"));
app.use("/reg",require("./routes/reg"));

app.listen(port, () =>
    console.log(`App listening at http://localhost:${port}`)
);

const dbConfig = require('./config/db.config');
mongoose.Promise = global.Promise;
mongoose.connect(dbConfig.url, {
    useNewUrlParser: true
}).then(() => {
    console.log("Database Connected!");
}).catch(err => {
    console.log('Could not connect!', err);
    process.exit();
});


app.use(bodyParser.json());
app.use(express.static('public'));
app.use(bodyParser.urlencoded({
    extended: true
}));

function  isLoggedIn(req,res,next){
    req.user ? next(): res.sendStatus(401);
}




app.use('/sign', require("./routes/home"));

app.get("/login", function(req, res){
    res.render(__dirname + "/routes/views/login.ejs");
});

app.get("/register", function(req, res){
    res.render("register");
});

app.get("/secret", function(req, res){
    if(req.isAuthenticated()){
        res.render("secretPage",{username:req.body.username,statusOf:"Default status"})
    }else{
        res.redirect("/login")
    }
});



app.get("/auth/google",
    passport.authenticate('google',{
        scope: ["profile"]
    })
)

app.get('/auth/google/callback',
    passport.authenticate('google', {
        failureRedirect: '/login'
    }),
    function(req, res) {
        res.redirect('/secret');
    });

app.get('/logout', (req,res)=>{
    req.logout();
    req.session.destroy();
    res.redirect('/log');
});

app.get('/show',(req,res)=>{
    if(req.isAuthenticated()){
        res.render("show")
    }else{
        res.redirect("/login")
    }
});
