const express = require('express')
const mysql = require('mysql2')
const expressLayouts = require('express-ejs-layouts')
const path = require('path')
const app = express()


app.set('views', path.join(__dirname, '/views'));
//utk css,img dan js
app.use('/css', express.static(path.resolve(__dirname, "assets/css")));
// app.use('/js', express.static(path.resolve(__dirname, "assets/js")));
app.use('/img', express.static(path.resolve(__dirname, "assets/img")));

//utk format ejs
app.set('view engine', 'ejs')

//utk layout
app.use(expressLayouts);

//koneksi database
const db = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    database: 'tubes'
  });

  db.connect((err)=>{
    if(err) throw err
   console.log('Database terhubung!');
  
  //router
   app.get('/profil', function (req, res) {
     const sql = "SELECT * FROM user";
      db.query(sql,(err,result)=>{
        const user = JSON.parse(JSON.stringify(result));
        res.send(user);
      })
    }) 

    //router
    app.get('/upload',(req,res)=>{

        const insertSql = "INSERT INTO user (username,email,password,active,sign_img,created_at,updated_at) VALUES (?, ?, ?, ?, ?, now(), now())";
    
        db.query(insertSql,['satria','satria@gmail.com','23456','1','satriapng'],(err,rows,result)=>{
    
    
          let response = {
            message : "Data berhasil ditambahkan",
            lastId : rows.insertId,
            error : err
          }
          res.send(response);
        })
        
    
    })

    
    //router
    app.get('/', function (req, res) {
        res.render('index',{ 
          title:"home", 
          layout:"layouts/mylayout"
        }) 
      
      //   app.get('/',(req,res)=>{
      //     res.send('home');
      })
        
      
       //router 
        app.get('/document',(req,res)=>{
            // res.render('document',{ 
            // title:"document",
            // layout:"layouts/mylayout"
            // }) 
            res.send('')
        })
      
        //router
        app.get('/template',(req,res)=>{
          res.render('template',{ 
              title:"template",
              layout:"layouts/mylayout"
              }) 
          })
})




app.listen(3000,()=>{
    console.log('Server running at port 3000');
}) 