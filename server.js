const express = require("express");
const app = express();
const bodyParser = require("body-parser");
const path = require("path");
const mysql = require("mysql");
const { error } = require("console");
const cors = require("cors");
const jwt = require("jsonwebtoken");
const { rejects } = require("assert");
const cookieParser = require("cookie-parser");
const { env } = require("process");
const { dotenv } = require("dotenv").config();


const user_secretkey = env.USER_SECRETKEY;
const admin_sercretkey = env.ADMIN_SECRETKEY;

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(cookieParser());

// Allow only requests from a specific domain
const corsOptions = {
  origin: "http://localhost:3000",
  credentials: true,
};

app.use(cors(corsOptions));

const port = process.env.PORT || 3001;

app.listen(port, () => {
  console.log(`Server running on ${port}`);
});

app.get("/api/ping", function (req, res) {
  res.json({ status: "Online" });
});

const connection = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "password",
  database: "lightnovelonline",
});

connection.connect((error) => {
  if (error) {
    console.log("error", error);
    return;
  } else {
    console.log("SUCUESSS database");
  }
});

app.get("/api/library/", ensureToken, async (req, res) => {
  jwt.verify(req.token, user_secretkey, async function (err, decodedToken) {
    if (err) {
      res.sendStatus(403);
    } else {
      try {
        const userLibData = await userLibrary(decodedToken.user); // Assuming userId is in the token
        res.json({ data: userLibData });
      } catch (error) {
        console.error(error);
        res.status(500).json({
          error: "An error occurred while fetching user library data.",
        });
      }
    }
  });
});

function userLibrary(id) {
  const query =
    "SELECT userLibrary.currentPage, Books.* FROM userLibrary JOIN Books ON userLibrary.bookid = Books.bookid WHERE userLibrary.userid = ?";

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

app.get(`/api/book`, async (req, res) => {
  const id = req.query.id;
  try {
    const [bookInfo, authorInfo] = await Promise.all([
      bookData(id),
      authorData(id),
    ]);
    res.json({ data: bookInfo, author: authorInfo });
  } catch (err) {
    console.log(err);
  }
});

function authorData(id) {
  const query = "SELECT author FROM books WHERE bookid = ?";

  return new Promise((resolve, reject) => {
    connection.query(query, [id], function (error, results) {
      if (error) {
        reject(error);
      } else {
        // Assuming results is an array and you want the first element (if any)
        const author =
          results.length > 0 ? results[0].author : "No author found";

        if (author) {
          connection.query(
            "SELECT userName FROM users WHERE userid = ?",
            [author],
            function (err, result) {
              if (err) {
                reject(err);
              } else {
                resolve(result);
              }
            }
          );
        } else {
          // Handle the case where no book with the given bookid is found.
          resolve(null);
        }
      }
    });
  });
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

app.post("/api/createaccount", function (req, res) {
  const data = req.body;

  //Check if user exist already

  connection.query(
    "SELECT * FROM users WHERE userEmail = ? OR userName = ?",
    [data.email, data.username],
    function (error, results) {
      if (error) {
        // Handle the error
        console.error("Error executing query:", error);
        res.status(500).json({ error: "An error occurred." });
        return;
      }
      if (results.length > 0) {
        // User with the provided email or username already exists
        const existingUser = results[0];
        if (
          existingUser.userEmail === data.email &&
          existingUser.userName === data.username
        ) {
          res.json({ message: "both exist" });
        } else if (existingUser.userEmail === data.email) {
          res.json({ message: "email exist" });
        } else if (existingUser.userName === data.username) {
          res.json({ message: "userName exist" });
        }
      } else {
        const query =
          "INSERT INTO users (userName,userPassword,userEmail) VALUES (?,?,?)";
        connection.query(
          query,
          [data.username, data.password, data.email],
          function (error, results) {
            if (error) {
              console.log(error);
            } else {
              res.json({ message: "user created" });
            }
          }
        );
      }
    }
  );
});

app.post("/api/logIn", function (req, res) {
  const data = req.body;

  const query = "SELECT * FROM users WHERE userName = ? AND userPassword = ?";
  connection.query(query, [data[0], data[1]], function (error, results) {
    if (error) {
      console.log(error);
    }
    if (results == null || results == undefined) {
      res.json({ message: "no user exist" });
      return;
    }
    if (results.length > 0) {
      const user = results[0]; // Assuming results contain user data
      const userName = user.userName;
      const token = jwt.sign({ user: user.userid }, user_secretkey);
      res.json({ message: "user exist", userName: userName, token: token });
    } else {
      res.json({ message: "no user exist" });
    }
  });
});

app.get("/api/protected", ensureToken, function (req, res) {
  if (!req.token) {
    res.json({ message: "no token" });
  }
  jwt.verify(req.token, user_secretkey, function (err, data) {
    if (err) {
      res.json({ message: "token invalid" });
    } else {
      res.json({
        message: "this is protected",
        data: data,
      });
    }
  });
});

function ensureToken(req, res, next) {
  const bearerHeader = req.headers["authorization"];
  if (typeof bearerHeader !== "undefined") {
    const bearer = bearerHeader.split(" ");
    const bearerToken = bearer[1];
    req.token = bearerToken;
    next();
  } else {
    res.sendStatus(403);
  }
  // console.log(req.token);
  // const token = req.cookies["authToken"];
  // console.log(token, req.cookies);
  // if (token) {
  //   req.token = token;
  //   next();
  // } else {
  //   res.sendStatus(403);
  // }
}

app.get("/api/latest", function (req, res) {
  const query =
    " SELECT * FROM lightnovelonline.books ORDER BY STR_TO_DATE(release_date, '%Y/%m/%d') DESC LIMIT 0,22;";

  connection.query(query, function (err, results) {
    res.json({ books: results });
  });
});

app.get("/api/novelsCreated", ensureToken, function (req, res) {
  jwt.verify(req.token, user_secretkey, async function (err, decodedToken) {
    if (err) {
      res.sendStatus(403);
    } else {
      const userID = decodedToken.user;
      const data = await usersNovels(userID);
      res.json({ data: data });
    }
  });
});

function usersNovels(id) {
  const query =
    "SELECT b.* FROM books AS b JOIN users AS u ON b.author = u.userid WHERE u.userid = ?";
  return new Promise((resolve, reject) => {
    connection.query(query, [id], function (err, results) {
      if (err) {
        return "error";
      } else {
        resolve(results);
      }
    });
  });
}

app.post("/api/AddToLibrary", ensureToken, function (req, res) {
  jwt.verify(req.token, user_secretkey, async function (err, decodedToken) {
    if (err) {
      res.sendStatus(403);
    } else {
      const userId = decodedToken.user;

      const query =
        "INSERT INTO userlibrary (userid,bookid,currentpage) VALUES (?,?,0)";

      connection.query(query, [userId, req.body.id], function (error, result) {
        if (error) {
          console.log(error);
        } else {
          connection.query(
            "UPDATE books SET totalinlibrary = totalinlibrary + 1 WHERE bookid = ?",
            [req.body.id],
            function (err, results) {
              if (err) {
                console.log(err);
              } else {
                res.sendStatus(200);
              }
            }
          );
        }
      });
    }
  });
});

app.delete("/api/RemoveFromLibrary", ensureToken, function (req, res) {
  jwt.verify(req.token, user_secretkey, async function (err, decodedToken) {
    if (err) {
      res.sendStatus(403);
    } else {
      const userId = decodedToken.user;
      const bookId = req.body.id;

      const query = "DELETE FROM userlibrary WHERE bookid = ? AND userid = ? ";

      connection.query(query, [bookId, userId], function (error, results) {
        if (error) {
          console.log(error);
        } else {
          connection.query(
            "UPDATE books SET totalinlibrary = totalinlibrary - 1 WHERE bookid = ?",
            [bookId],
            function (error, results) {
              if (error) {
                res.json({ error: error });
              } else {
                res.json({ message: "Book removed from library" });
              }
            }
          );
        }
      });
    }
  });
});

app.post("/api/checkLibrary", ensureToken, function (req, res) {
  if (req.token === null || req.token === "null") {
    res.json({ message: "no token" });
    return;
  }
  jwt.verify(req.token, user_secretkey, function (err, decodedToken) {
    if (err) {
      res.sendStatus(403);
    } else {
      const userid = decodedToken.user;
      const bookid = req.body.id;

      const query = "SELECT * FROM userLibrary WHERE userid = ? AND bookid = ?";
      connection.query(query, [userid, bookid], function (error, results) {
        if (error) {
          console.log(error);
        } else {
          if (results.length > 0) {
            res.json({ message: "exist" });
          } else {
            res.json({ message: "does not exist" });
          }
        }
      });
    }
  });
});

app.post("/api/BooksBasedOnSearch", function (req, res) {
  const input = req.body.data;

  const query = `SELECT * FROM books WHERE title LIKE '%${input}%' LIMIT 10`;

  connection.query(query, function (err, results) {
    if (err) {
      res.json({ error: "error" });
    } else if (results.length > 0) {
      res.json({ data: results });
    } else {
      res.json({ data: "No books" });
    }
  });
});

app.post("/api/createNewBook", ensureToken, function (req, res) {
  jwt.verify(req.token, user_secretkey, function (err, decodedToken) {
    if (err) {
      res.sendStatus(403);
    } else {
      const userId = decodedToken.user;
      const data = req.body;

      // Check if a book with the same title or synopsis exists
      connection.query(
        "SELECT * FROM books WHERE title = ? OR bookid IN (SELECT bookid FROM bookinfo WHERE synopsis = ?)",
        [data.Title, data.Synopsis],
        function (err, results) {
          if (err) {
            console.log(err);
            res.sendStatus(500);
            return;
          }

          if (results.length > 0) {
            if (results[0].title === data.Title) {
              res.json({ message: "Title exists" });
            } else {
              res.json({ error: "Synopsis exists" });
            }
          } else {
            const date = new Date();
            const month = date.getMonth() + 1;
            const day = date.getDate();
            const year = date.getFullYear();
            const currentDate = `${year}/${month}/${day}`;

            // Neither title nor synopsis exists, so proceed to insert the new book
            connection.query(
              "INSERT INTO books (title, bookcover,release_date,author) VALUES (?,?,?,?)",
              [data.Title, "test", currentDate, userId],
              function (err, insertResult) {
                if (err) {
                  console.log(err);
                  res.sendStatus(500);
                } else {
                  connection.query(
                    "INSERT INTO bookinfo (bookid,synopsis,genres,language,tags,warnings) VALUES (?,?,?,?,?,?)",
                    [
                      insertResult.insertId,
                      data.Synopsis,
                      data.Genre,
                      data.Language,
                      data.Tags,
                      data.Warnings,
                    ],
                    function (err, results) {
                      if (err) {
                        console.log(err);
                      } else {
                        res.json({ message: "New book inserted" });
                      }
                    }
                  );
                }
              }
            );
          }
        }
      );
    }
  });
});

app.get("/api/ranking", function (req, res) {
  const query =
    "SELECT * FROM lightnovelonline.books ORDER BY totalinlibrary LIMIT 0,50";


  connection.query(query, function (err, results) {
    if (err) {
      res.json({ error: "error" });
    } else {
      res.json({ books: results });
    }
  });
});

app.get("/api/authorInfo", function (req, res) {
  const author = req.query.authorName;

  const query = "SELECT userid FROM lightnovelonline.users WHERE userName = ?";

  connection.query(query, [author], function (err, results) {
    if (err) {
      console.log(err);
    } else {

      if (results.length === 0){
        res.json({message:"no author found"})
        return;
      }

      const authorId = results[0].userid;

      const query = `
      SELECT *
      FROM lightnovelonline.books AS b
      JOIN lightnovelonline.bookinfo AS bi ON b.author = bi.authorid
      WHERE b.author = ?;
    `;
      connection.query(query, [authorId,authorId], function (err, results) {
        if (err) {
          console.log(err);
        } else {
          res.json({ books: results });
        }
      });
    }
  });
});

app.post("/api/admin/login", function (req, res) {
  const query =
    "SELECT * FROM lightnovelonline.admins WHERE adminName = ? AND adminPassword = ?";

  connection.query(query, [req.body[0], req.body[1]], function (err,results) {
      if (err) {
        console.log(err);
      } else {
        if (results === undefined){
          res.json({message:"error"})
        }
        if (results.length > 0) {
          const token = jwt.sign(
            { admin: results[0].adminid },
            admin_sercretkey
          );
          res.json({ message: "success",token:token });
        } else {
         
          res.json({ message: "fail" });
        }
      }
    });
});

app.get("/api/admin/access",ensureToken, function (req, res) {
  jwt.verify(req.token, admin_sercretkey, function (err, decoded) {
    if (err) {
      res.json({message:"error"});
    } else {
      res.json({ message: "success" });
    }
  });
});


module.exports = app;
