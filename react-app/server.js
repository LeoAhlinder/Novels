const express = require("express")
const app = express()
const bodyParser = require("body-parser")
const path = require('path');
const mysql = require("mysql");
const { error } = require("console");


app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());


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
        console.log("SUCUESSS")
    }
  })


app.get("/api/profile",function(res,req){
  res.json({message:"YUP"})
})
  