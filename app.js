const express = require('express')
const expressLayouts = require('express-ejs-layouts')
const bodyParser = require('body-parser');
const path = require('path')
const moment = require('moment');
const mysql = require('mysql2')
const jwt = require('jsonwebtoken');
const app = express()
const bcrypt = require('bcryptjs')
const cookieParser = require('cookie-parser');

app.use(express.json());
// middleware untuk parsing request body
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(cookieParser());

//biar bisa pake css,img dan js
app.use('/css', express.static(path.resolve(__dirname, "assets/css")));
// app.use('/js', express.static(path.resolve(__dirname, "assets/js")));
app.use('/img', express.static(path.resolve(__dirname, "assets/img")));

// template engine
app.set('view engine', 'ejs')

//biar bisa bikin layout
app.use(expressLayouts);

// mengatur folder views
app.set('views', './views');


//koneksi database
const db = mysql.createConnection({
host: 'localhost',
user: 'root',
database: 'tubes'
});

db.connect((err)=>{
if(err) throw err
console.log('Database terhubung')
})

const saltRounds = 10;

  app.get('/signup', function (req, res) {
  res.render('signup',{
    title : 'Signup',
    layout : 'layouts/otentikasi'
    });
  })
    
  app.post('/signup', async (req, res) => {
    const { username, email, password, confirm_password } = req.body;
  
    // Check if username already exists
    const sqlCheck = 'SELECT * FROM users WHERE username = ?';
    db.query(sqlCheck, username, (err, result) => {
      if (err) throw err;
  
      if (result.length > 0) {
        // Username already exists, send error response
        return res.status(400).send('Username already exists');
      }

      if (password.length < 8) {
        // Password is too short, send error response
        return res.status(400).send('Password must be at least 8 characters long');
      }
  
      if (password !== confirm_password) {
        // Passwords do not match, send error response
        return res.status(400).send('Passwords do not match');
      }
  
      // Insert user to database
      const sqlInsert = 'INSERT INTO users (username, email, password) VALUES (?, ?, ?)';
      const values = [username, email, password];
      db.query(sqlInsert, values, (err, result) => {
        if (err) throw err;
        console.log('User registered successfully');
        
        res.redirect('/login');
      });
    });
  });
  
  // Login form
  app.get('/login', function (req, res) {
    res.render('login', {
      title: 'Login',
      layout: 'layouts/otentikasi'
    });
  });
  
  app.post('/login', function (req, res) {
    const { username, password } = req.body;
  
    // Check if username exists
    const sqlCheck = 'SELECT * FROM users WHERE username = ?';
    db.query(sqlCheck, username, (err, result) => {
      if (err) throw err;
  
      if (result.length === 0) {
        return res.status(400).send('Username does not exist');
      }
  
      const user = result[0];
  
      if (password !== user.password) {
        return res.status(400).send('Invalid password');
      }
  
      // Generate JWT token
      const token = jwt.sign({ id: user.id, username: user.username }, 'your-secret-key');
  
      // Set token as a cookie
      res.cookie('token', token, { httpOnly: true });
  
      // Redirect to main page
      res.redirect('/');
    });
  });
  
  // Home page
  app.get('/', function (req, res) {
    // Get token from cookie
    const token = req.cookies.token;
  
    if (!token) {
      return res.redirect('/login');
    }
  
    // Verify token
    jwt.verify(token, 'your-secret-key', function (err, decoded) {
      if (err) {
        return res.redirect('/login');
      }
  
      const { username } = decoded;
  
      // Render the home page
      res.render('index', {
        title: 'Home',
        layout: 'layouts/kerangka',
        username: username
      });
    });
  });

  app.post('/forgot-password', (req, res) => {
    const email = req.body.email;

    // Lakukan validasi email dan proses lupa password di sini
    // ...

    // Kirim respon JSON
    res.json({ message: 'Email untuk reset password telah dikirim.' });
});

  app.get('/profil', function (req, res) {
      res.render('profil',{ 
      title:"Profil",
      layout:"layouts/kerangka"
      }) 
  })


  app.get('/upload', function (req, res) {
    res.render('upload',{ 
    title:"Upload",
    layout:"layouts/kerangka"
    }) 
  })
  
  app.get('/document', function (req, res) {
      res.render('document',{ 
      title:"Document",
      layout:"layouts/kerangka"
      }) 
  })

  app.get('/message', function (req, res) {
    res.render('message',{ 
    title:"Message",
    layout:"layouts/kerangka"
    }) 
  })

app.listen(3000,()=>{
    console.log("GO!");
})

