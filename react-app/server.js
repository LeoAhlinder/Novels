const express = require("express")
const app = express()
const bodyParser = require("body-parser")
const path = require('path');
const mysql = require("mysql");
const { error } = require("console");
const cors = require('cors');
const jwt = require('jsonwebtoken');
const { rejects } = require("assert");

const secretkey = "leo"

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

app.get("/api/library/", ensureToken, async (req, res) => {
  jwt.verify(req.token, secretkey, async function(err, decodedToken) {
      if (err) {
          console.log("F")
          res.sendStatus(403);
      } else {
          try {
              const userLibData = await userLibrary(decodedToken.user); // Assuming userId is in the token
              res.json({ data: userLibData });
          } catch (error) {
              console.error(error);
              res.status(500).json({ error: "An error occurred while fetching user library data." });
          }
      }
  });
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


app.get(`/api/book`,ensureToken, async (req,res) =>{

  jwt.verify(req.token,secretkey,async function(err,decodedToken){
    if (err){
      res.sendStatus(403)
    }else{
      const id = req.query.id;
      try{
        const bookInfo = await bookData(id)
        const authorInfo = await authorData(id)
        res.json({data:bookInfo,author:authorInfo})
      }catch(err){
        console.log(err)
      }
    }
  })
})

function authorData(id){
  const query = "SELECT userName FROM users WHERE userid = ?"

  return new Promise((resolve,reject) =>{
    connection.query(query,[id],function(error,results){
      if (error){
        reject(error)
      }
      else{
        resolve(results)
      }
    })
  }) 
}

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
      const userName = user.userName;
      const token = jwt.sign({ user: user.userid }, secretkey);
      
      res.json({ message: "user exist",userName:userName, token: token });
    }
    else{
      res.json({message:"no user exist"})
    }
  })
})

app.get("/api/protected",ensureToken,function(req,res){

  jwt.verify(req.token,secretkey,function(err,data){
    if (err)(
      res.sendStatus(403)
    )
    else{
      res.json({
        message: "this is protected",
        data:data
      })
    }
  })
})

function ensureToken(req,res,next){
  const bearerHeader = req.headers["authorization"];
  if (typeof bearerHeader !== "undefined"){
    const bearer = bearerHeader.split(" ");
    const bearerToken = bearer[1]
    req.token = bearerToken
    next();
  }
  else{
    res.sendStatus(403)
  }
}

app.get("/api/latest",function(req,res){
  
  const query = " SELECT * FROM lightnovelonline.books ORDER BY STR_TO_DATE(release_date, '%Y/%m/%d') DESC;"

  connection.query(query,function(err,results){
    res.json({books:results})
  })
})

app.get("/api/novelsCreated",ensureToken,function(req,res){
  jwt.verify(req.token,secretkey,async function(err,decodedToken){
    if (err){
      res.sendStatus(403)
    }
    else{
      const userID = decodedToken.user;
      const data = await usersNovels(userID)
      res.json({data:data})
    }
  })
})


function usersNovels(id){
  const query = "SELECT b.* FROM books AS b JOIN users AS u ON b.author = u.userid WHERE u.userid = ?"
  return new Promise((resolve,reject) =>{
    connection.query(query,[id],function(err,results){
      if (err){
        reject(err)
      }
      else{
        resolve(results)
      }
    })
  })
}

app.post("/api/AddToLibrary",ensureToken,function(req,res){

  jwt.verify(req.token,secretkey,async function(err,decodedToken){
    if (err){
      res.sendStatus(403)
    }else{
      const userId = decodedToken.user;
      
      const query = "INSERT INTO userlibrary (userid,bookid,currentpage) VALUES (?,?,0)"

      connection.query(query,[userId,req.body.id],function(error,results){
        if (error){
          console.log(error)
        }
        else{
          res.sendStatus(200)
        }
      })

    }
  })
})


app.post("/api/checkLibrary",ensureToken,function(req,res){
  jwt.verify(req.token,secretkey,function(err,decodedToken){
    if (err){
      res.sendStatus(403)
    }else{

      const userid = decodedToken.user;
      const bookid = req.body.id

      const query = "SELECT * FROM userLibrary WHERE userid = ? AND bookid = ?"
      connection.query(query,[userid,bookid],function(error,results){
        if (error){
          console.log(error)
        }else{
          if (results.length > 0){
            res.json({message:"exist"})
          }
          else{
            res.json({message:"does not exist"})
          }
        }
      })
    }
  })
})

module.exports = app;
