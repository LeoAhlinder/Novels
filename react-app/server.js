const express = require("express")
const app = express()
const bodyParser = require("body-parser")
const path = require('path');
const mysql = require("mysql");
const { error } = require("console");
const cors = require('cors');
const jwt = require('jsonwebtoken');



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
  
app.get("/api/library/:userId", async (req, res) => {
  const id = req.params.userId;

  try {
    const userLibData = await userLibrary(id);
    res.json({data:userLibData}); // Send the data back as a JSON response
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "An error occurred while fetching user library data." });
  }
});

function userLibrary(id) {
  const query = "SELECT userLibrary.currentPage, Books.* FROM userLibrary JOIN Books ON userLibrary.bookid = Books.bookid WHERE userLibrary.userid = ?";

  return new Promise((resolve, reject) => {
    connection.query(query, [id], function (error, results) {
      if (error) {
        reject(error);
      } else {
        resolve(results);
      }
    });
  });
}


app.get(`/api/book`, async (req,res) =>{
  const id = req.query.id;
  try{
    const bookInfo = await bookData(id)
    res.json({data:bookInfo})
  }catch(err){
    console.log(err)
  }
})

function bookData(id) {
  const query = "SELECT * FROM lightnovelonline.books WHERE bookid = ?";

  return new Promise((resolve, reject) => {
    connection.query(query, [id], function (error, results) {
      if (error) {
        reject(error);
      } else {
        resolve(results);
      }
    });
  });
}


app.post("/api/createaccount",function(req,res){
  const data = req.body;

  //Check if user exist already

  connection.query("SELECT * FROM users WHERE userEmail = ? OR userName = ?",[data.email,data.username],function(error,results){
    if (error) {
        // Handle the error
        console.error("Error executing query:", error);
        res.status(500).json({ error: "An error occurred." });
        return;
      }
    if (results.length > 0)
     {
      // User with the provided email or username already exists
      const existingUser = results[0];
      if (existingUser.userEmail === data.email && existingUser.userName === data.username){
        res.json({message:"both exist"})
      }
      else if (existingUser.userEmail === data.email) {
        res.json({message:"email exist"})
      } 
      else if (existingUser.userName === data.username) {
        res.json({message:"userName exist"})
      } 
    }
    else{
      const query = "INSERT INTO users (userName,userPassword,userEmail) VALUES (?,?,?)"
      connection.query(query,[data.username,data.password,data.email],function(error,results){
        if (error){
          console.log(error)
        }
        else{
          res.json({message:"user created"})
        }
      })
    }
  })
})

app.post("/api/logIn",function(req,res){
  const data = req.body;

  const query = "SELECT * FROM users WHERE userEmail = ? AND userPassword = ?";
  connection.query(query,[data[0],data[1]],function(error,results){
    if (error){
      console.log(error)
    }
    if (results.length > 0){

      const user = results[0]; // Assuming results contain user data
      const token = jwt.sign({ userId: user.userId }, 'your-secret-key', { expiresIn: '1h' });
      
      res.json({ message: "user exist", token: token });
    }
    else{
      res.json({message:"no user exist"})
    }
  })
})