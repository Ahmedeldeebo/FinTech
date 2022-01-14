const express = require('express')
const app = express()
const session = require('express-session');
const port = 3000;
const mongoose = require("mongoose");
const ejs = require('ejs');
const bcrypt=require("bcrypt");
// const passport= require('passport');
// const initializePassport = require('./passport-config');
// initializePassport(passport);
var cookieParser = require("cookie-parser");
app.use(cookieParser());



var path = require('path');
const User = require('./User.js');
const { find } = require('./User.js');
app.use(express.urlencoded({extended:false}));
app.use(express.json());
app.use(session({
  key: 'future_University',
  secret: 'Fue-key',
  resave: false,
  saveUninitialized: false,
  cookie:{
    expires:100000,
  },
  
}))

const mongoUri = "mongodb+srv://admin:FUE123456@cluster0.wpgz1.mongodb.net/myFirstDatabase?retryWrites=true&w=majority"

mongoose.connect( mongoUri , { useNewUrlParser: true, useUnifiedTopology: true  } )
     .then( ()=>{ console.log("Mongo connected") } )
      

     app.use((req, res, next) => {
      if (req.cookies.future_University && req.session.user) {
        res.clearCookie("future_University");
      }
      next();
    });
    app.use((req, res, next) => {
      if (req.cookies.user_sid && !req.session.user) {
        res.clearCookie("future_University");
      }
      next();
    });
    // middleware function to check for logged-in users
    var sessionChecker = (req, res, next) => {
      if (req.session.user && req.cookies.future_University) {
        res.redirect("/home");
      } else {
        next();
      }
    };
app.get('/signin',sessionChecker, (req, res) => {
    res.render('signin.ejs' , {errorMessage:""});
    // var options = {
    //     root: path.join(__dirname)
    // };
    // var fileName = 'signin.html';
    // res.sendFile(fileName, options, function (err) {
    //     if (err) {
    //         next(err);
    //     } else {
    //         console.log('Sent:', fileName);
    //     }
    // });
  // send login html page 
})


app.get('/',(req,res)=>{
  res.render('aboutUs.ejs')
})
app.get('/register' , (req,res) =>{
    res.render('register.ejs');
} ) 
app.get('/home' ,sessionChecker, (req,res) =>{
  res.render('home.ejs',{users:[]});

} ) 
app.get('/chat',sessionChecker,(req,res)=>{
  res.render('chat.ejs');
})
app.get('/profile',sessionChecker,(req,res)=>{
  const body =req.body;
  console.log(req.session.body)
 const users=User.find({"firstName":body.firstName},function(err,users){
    console.log(users);
    res.render('profile.ejs',{users:users});
  })
})
app.post('/signup',sessionChecker , async (req, res) => {
    const body =  req.body;
    console.log(body);
    const email = body.email;
    const password = body.password;
    const firstName = body.firstName;
    const lastName = body.lastName;
    const job = body.job;
    const city=body.city;
    const user = await User.create( {"email":email , "password": password, "firstName": firstName , "lastName": lastName , "job":job , "city":city } );
    console.log(user);  
    res.render('signin.ejs', {errorMessage:"Wrong email or password"});

})

app.post('/login',sessionChecker, async (req, res) => {
         const body =  req.body;
         console.log(body);
         const email = body.email;
         const password = body.password;
       const user = await User.findOne({"email": email, "password" : password});
       console.log(user);
       if(user !== null)
       {
           // redirect to home page
           console.log("Success")
           res.render('home.ejs',{users:[]});
       }
       else{
       console.log("Error");
       res.render('signin.ejs' , {errorMessage:"Wrong email or password"});
       }
       console.log(user);
         // select * from db where username = username AND password = password

  });
  app.post('/search',sessionChecker,async(req,res)=>{
    const body =req.body;
    console.log(req.session.body)
   const users=await User.find({"job":body.job})
   console.log(users);
  res.render('home.ejs',{users:users})
    
  });
  // route for user logout
app.get("/logout",sessionChecker, (req, res) => {
  if (req.session.user && req.cookies.future_University) {
    res.clearCookie("future_University");
    res.redirect("/");
  } else {
    res.redirect("/aboutUs");
  }
});
app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`)
})
app.use(express.static(__dirname + '/public'));



// Create user 
// User.create( {email:"maroushdy2@gmail.com" , password: "123", name: "Mohamed" , job:"IT"} )