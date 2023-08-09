const express = require("express")
const app = express()
const bodyParser = require("body-parser")
const path = require('path');
const mysql = require("mysql");
const { error } = require("console");
const cors = require('cors');


app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

// Allow only requests from a specific domain
const corsOptions = {
  origin: 'http://localhost:3000  ',
};

app.use(cors(corsOptions));



const port = process.env.PORT || 3001

app.listen(port,()=>{
  console.log(`Server running on ${port}`)
})

const connection = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'password',
    database: 'lightnovelonline',
  });


  connection.connect((error) =>{
    if (error){
        console.log("error",error)
        return;
    }
    else{
        console.log("SUCUESSS database")
    }
  })


app.get("/api/profile",function(req,res){

})
  

app.get("/api/library",function(req,res){

  const userId = req.body.userId;

  res.json({message:userId})

  const query = "SELECT userLibrary.currentPage, Books.* FROM userLibrary JOIN Books ON userLibrary.bookid = Books.bookid WHERE userLibrary.userid = 1"

  connection.query(query,function(results,error){
    console.log(results)
    res.json()
    console.log(error)
  })
})