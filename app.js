const express = require('express')
const expressLayouts = require('express-ejs-layouts')
const bodyParser = require('body-parser');
const path = require('path')
const moment = require('moment');
const mysql = require('mysql2')
const jwt = require('jsonwebtoken');
const app = express()
const bcrypt = require('bcrypt');
const cookieParser = require('cookie-parser');
const session = require('express-session');
const multer = require('multer');
const { PDFDocument, StandardFonts, rgb } = require('pdf-lib');
const fs = require('fs').promises;

app.use(express.json());
// middleware untuk parsing request body
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(cookieParser());

//biar bisa pake css,img dan js
app.use('/css', express.static(path.resolve(__dirname, "assets/css")));
// app.use('/js', express.static(path.resolve(__dirname, "assets/js")));
app.use('/img', express.static(path.resolve(__dirname, "assets/img")));

app.set('view engine', 'pug');

// template engine
app.set('view engine', 'ejs')

//biar bisa bikin layout
app.use(expressLayouts);

// mengatur folder views
app.set('views', path.join(__dirname, 'views'));

app.use(session({
  secret: 'secret_key',
  resave: false,
  saveUninitialized: true
}));


//Konfigurasi penyimpanan file menggunakan multer
const storage = multer.diskStorage({
  destination: 'uploads/', // Direktori penyimpanan file
  filename: (req, file, cb) => {
    cb(null, file.originalname); // Nama file yang digunakan adalah nama asli file
  }
});

const upload = multer({ storage });

module.exports = upload;

const saltRounds = 10;


//Koneksi database
const db = mysql.createConnection({
host: 'localhost',
user: 'root',
database: 'tubes'
});

db.connect((err)=>{
if(err) throw err
console.log('Database terhubung')
})


//=================
//Signup
//=================
app.get('/signup', function (req, res) {
  res.render('signup', {
    title: 'Signup',
    layout: 'layouts/otentikasi'
  });
});
  

app.post('/signup', function (req, res) {
  const { username, email, password, confirm_password } = req.body;
  let account = [username, email];

  if (!username || !email || !password || !confirm_password) {
    return res.status(400).json({ error: 'Silakan lengkapi semua data' });
  }

  // check if username or email already exists
  const sqlCheck = 'SELECT * FROM users WHERE username = ? OR email = ?';
  db.query(sqlCheck, account, (err, result) => {
    if (err) {
      console.error(err);
      return res.status(500).json({ error: 'Terjadi kesalahan pada server' });
    }

    if (result.length > 0) {
      const existingUser = result.find(user => user.username === username);
      const existingEmail = result.find(user => user.email === email);

      // Username already exists
      if (existingUser) {
        return res.status(400).json({ error: 'Username sudah ada! Silakan gunakan username lain' });
      }

      // Email already exists
      if (existingEmail) {
        return res.status(400).json({ error: 'Email sudah ada! Silakan gunakan email lain.' });
      }
    }

    if (password !== confirm_password) {
      // Passwords do not match, send error response
      return res.status(400).json({ error: 'Passwords tidak cocok!' });
    }

    if (password.length < 8) {
      // Password length is less than 8 characters, send error response
      return res.status(400).json({ error: 'Isi password minimal 8 karakter!' });
    }

    // hash password
    bcrypt.hash(password, saltRounds, function (err, hash) {
      if (err) {
        console.error(err);
        return res.status(500).json({ error: 'Terjadi kesalahan pada server' });
      }

      // insert user to database with 'active' set to 1
      const sqlInsert = 'INSERT INTO users (username, email, password) VALUES (?, ?, ?)';
      const values = [username, email, hash];
      db.query(sqlInsert, values, (err, result) => {
        if (err) {
          console.error(err);
          return res.status(500).json({ error: 'Terjadi kesalahan pada server' });
        }

        console.log('user registered');
        res.json({ message: 'User registered successfully!' });
      });
    });
  });
});


//=================
//Login
//=================
app.get('/login', function (req, res) {
  res.render('login', {
  title: 'Login',
  layout: 'layouts/otentikasi'
  });
});


app.post('/login', function (req, res) {
  const { usernameOrEmail, password } = req.body;

  const sql = 'SELECT * FROM users WHERE username = ? OR email = ?';
  db.query(sql, [usernameOrEmail, usernameOrEmail], function(err, result) {
    if (err) {
      console.error(err);
      return res.status(500).json({ error: 'Terjadi kesalahan pada server' });
    }

    if (result.length === 0) {
      // Username or email is not found
      return res.status(401).json({ error: 'Username atau email tidak ditemukan' });
    }

    const user = result[0];

    // Compare password
    bcrypt.compare(password, user.password, function(err, isValid) {
      if (err) {
        console.error(err);
        return res.status(500).json({ error: 'Terjadi kesalahan pada server' });
      }

      if (!isValid) {
        // Password is incorrect
        return res.status(401).json({ error: 'Password Anda salah!' });
      }
    

        // Generate token
        const token = jwt.sign({ user_id: user.user_id }, 'secret_key');
        res.cookie('token', token, { httpOnly: true });

        return res.status(200).json({ message: 'Login berhasil' });
    });
  });
})


function requireAuth(req, res, next) {
  const token = req.cookies.token;

  if (!token) {
    return res.redirect('/login');
  }

  jwt.verify(token, 'secret_key', function(err, decoded) {
    if (err) {
      console.error(err);
      return res.redirect('/login');
    }

    req.user_id = decoded.user_id;
    next();
  });
}


//=================
//halaman utama
//=================
app.get('/', requireAuth, function (req, res) {
  if (!req.user_id) {
    // Pengguna tidak memiliki token yang valid
    return res.redirect('/login');
  }

  res.render('index', {
    title: 'Home',
    layout: 'layouts/kerangka'
  });
});


//=================
//Profil
//=================
app.get('/profil', requireAuth, (req, res) => {
  const user_id = req.user_id;
  const selectSql = `SELECT * FROM users WHERE user_id = ${user_id}`;
  db.query(selectSql, (err,result)=>{
    if (err) throw err;
      res.render('profil',{
        user: result[0],
        title:'Profil',
        layout:'layouts/kerangka'
    });
  });
});

//Edit Profil
app.post('/edit-profil', upload.single('sign_img'), requireAuth, (req, res) => {
  let user_id = req.user_id;
  const { username, email } = req.body;
  const signImg = req.file ? req.file.filename : null;

  // Build update query and values
  let updateQuery = 'UPDATE users SET username=?, email=?';
  let values = [username, email];

  if (signImg) {
    updateQuery += ', sign_img=?';
    values.push(signImg);
  }

  updateQuery += ' WHERE user_id=?';
  values.push(user_id);

  // Update data in MySQL
  db.query(updateQuery, values, (err, result) => {
    if (err) {
      throw err;
    }
    console.log('Data updated in MySQL!');

    // Copy file to img directory
    if (signImg) {
      const signImgSource = path.join(__dirname, 'uploads', signImg);
      const signImgDestination = path.join(__dirname, 'assets', 'img', signImg);
      fs.copyFileSync(signImgSource, signImgDestination);
    }

    req.session.profilsuccessMessage = 'Profil berhasil diubah';

    // Create JSON response
    const jsonResponse = {
      success: true,
      message: req.session.profilsuccessMessage
    };

    res.json(jsonResponse);
  });
});


//Change Pasword
app.post('/change-password', requireAuth, (req, res) => {
  const userId = req.user_id;
  const { password, new_password, confirm_new_password } = req.body;

  const Passsql = 'SELECT password FROM users WHERE user_id = ?';
  db.query(Passsql, [userId], (error, result) => {
    if (error) {
      console.log({ pesan: 'Server Error', error });
      res.redirect('/profil');
      return;
    }

    const hashedPassword = result[0].password;
    bcrypt.compare(password, hashedPassword, (error, isMatch) => {
      if (error) {
        console.log({ pesan: 'Server Error', error });
        res.redirect('/profil');
        return;
      }

      if (isMatch) {
        if (new_password === confirm_new_password) {
          bcrypt.hash(new_password, saltRounds, (err, hashedNewPassword) => {
            if (err) {
              console.log({ pesan: 'Server Error', err });
              res.redirect('/profil');
              return;
            }
            const updateSql = 'UPDATE users SET password = ? WHERE user_id = ?';
            const values = [hashedNewPassword, userId];
            db.query(updateSql, values, (err, result) => {
              if (err) {
                console.log({ pesan: 'Server Error', err });
                res.redirect('/profil');
                return;
              }
              console.log({ pesan: 'Password berhasil diubah', values });
              res.redirect('/profil');
            });
          });
        } else {
          console.log({ pesan: 'New password and confirm new password do not match' });
          res.redirect('/profil');
        }
      } else {
        res.redirect('/profil');
      }
    });
  });
});


//Logout
app.get('/logout', function(req, res) {
  res.clearCookie('token');
  res.redirect('/login');
});


//=================
//Document
//=================
app.get('/document', requireAuth, function (req, res) {
  let user_id = req.user_id;
  const sqlDoc = `SELECT documents.name, documents.filename, signature.status
    FROM documents
    JOIN signature ON documents.document_id = signature.document_id
    WHERE signature.user_id = ${user_id}`;
  const sqlUsers = `SELECT * FROM users WHERE user_id != ${user_id}`;

  db.query(sqlDoc, function (err, docResult) {
    if (err) throw err;

    db.query(sqlUsers, function (err, usersResult) {
      if (err) throw err;

      res.render('document', {
        title: 'Document',
        layout: 'layouts/kerangka',
        documents: docResult,
        users: usersResult,
        moment: moment
      });
    });
  });
});


//Send
app.post('/send-data', upload.single('filename'), requireAuth, (req, res) => {
  const { username, name, description, jabatan } = req.body;
  const filename = req.file ? req.file.filename : null;

  // Cek keberadaan username tujuan dalam database
  const selectUserSql = 'SELECT * FROM users WHERE username = ?';
  db.query(selectUserSql, [username], (err, userResult) => {
    if (err) {
      throw err;
    }

    // Cek apakah username tujuan ditemukan
    if (userResult.length === 0) {
      req.session.errorMessage = 'Username tujuan tidak ditemukan';
      return res.json({ success: false, message: 'Username tujuan tidak ditemukan' });
    }

    const tujuan_id = userResult[0].user_id; // Mendapatkan ID username tujuan dari hasil query

    // Lanjutkan dengan proses pengiriman data jika username tujuan ditemukan

    // Insert data ke tabel document di MySQL
    const insertdocumentql = 'INSERT INTO documents (name, filename, description) VALUES (?, ?, ?)';
    const documentValues = [name, filename, description];

    db.query(insertdocumentql, documentValues, (err, documentResult) => {
      if (err) {
        throw err;
      }

      console.log('Data inserted to document table!');

      // Get the newly inserted document ID
      const documentId = documentResult.insertId;

      // Insert data ke tabel signature di MySQL
      const insertSignatureSql = 'INSERT INTO signature (user_id, document_id, jabatan, tujuan_id) VALUES (?, ?, ?, ?)';
      const signatureValues = [req.user_id, documentId, jabatan, tujuan_id];

      db.query(insertSignatureSql, signatureValues, (err, signatureResult) => {
        if (err) {
          throw err;
        }

        console.log('Data inserted to signature table!');

        req.session.successMessage = 'Dokumen berhasil dikirim';
        res.json({ success: true, message: 'Dokumen berhasil dikirim' });
      });
    });
  });
});

// Endpoint untuk menampilkan dokumen yang dikirim
app.get('/viewdocument', (req, res) => {
  const file = req.query.file; // Mendapatkan nilai parameter 'file' dari query string
  const filePath = path.join(__dirname, 'uploads', file);
  res.sendFile(filePath);
});


//=================
//Message
//=================
app.get("/message", requireAuth, function (req, res) {
  const user_id = req.user_id;
  const senders = `
    SELECT *
    FROM documents
    INNER JOIN signature ON documents.document_id = signature.document_id
    WHERE signature.tujuan_id = ${user_id}
  `;
  db.query(senders, (err, result) => {
    if (err) throw err;

    res.render("message", {
      senders: result,
      moment: moment,
      title: "Messages",
      layout: "layouts/kerangka"
    });
  });
});


// Endpoint untuk menampilkan dokumen pada message
app.get('/viewmessage', (req, res) => {
  const fileName = req.query.file;
  const filePath = path.join(__dirname, 'uploads', fileName);
  res.sendFile(filePath);
});




app.listen(3000,()=>{
  console.log("Connect")
})