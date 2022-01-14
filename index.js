const express = require('express')
const app = express()
const session = require('express-session');
const port = 3000;
const mongoose = require("mongoose");
const ejs = require('ejs');

var path = require('path');
const User = require('./User.js');
const { find } = require('./User.js');
app.use(express.urlencoded({extended:true}));
app.use(express.json());
app.use(session({
  secret: 'Fue-key',
  resave: false,
  saveUninitialized: false,
}))

const mongoUri = "mongodb+srv://admin:FUE123456@cluster0.wpgz1.mongodb.net/myFirstDatabase?retryWrites=true&w=majority"

mongoose.connect( mongoUri , { useNewUrlParser: true, useUnifiedTopology: true  } )
     .then( ()=>{ console.log("Mongo connected") } )
      


app.get('/signin', (req, res) => {
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
app.get('/home' , (req,res) =>{
  res.render('home.ejs');

} ) 
app.get('/profile',async (req,res)=>{
  const body =req.body;
  console.log(req.body)
 const users=await User.find({"firstName":body.firstName})
 console.log(users);
  res.render('profile.ejs',{users:users});
})




app.post('/signup', async (req, res) => {
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

app.post('/login', async (req, res) => {
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
  app.post('/search',async(req,res)=>{
    const body =req.body;
    console.log(req.body)
   const users=await User.find({"job":body.job})
   console.log(users);
  res.render('home.ejs',{users:users})
    
  });
app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`)
})
app.use(express.static(__dirname + '/public'));



// Create user 
// User.create( {email:"maroushdy2@gmail.com" , password: "123", name: "Mohamed" , job:"IT"} )