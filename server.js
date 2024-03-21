const express = require("express");
const app = express();
const bodyParser = require("body-parser");
const path = require("path");
const mysql = require("mysql2");
const cors = require("cors");
const jwt = require("jsonwebtoken");
const cookieParser = require("cookie-parser");
const validator = require("validator");
const bcrypt = require("bcrypt");

const { env } = require("process");
const { config } = require("dotenv");

// Load environment variables from .env file
config();

const user_secretkey = env.USER_SECRETKEY;
const admin_secretkey = env.ADMIN_SECRETKEY;

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(cookieParser());

// Allow only requests from a specific domain
const corsOptions = {
  origin: "https://152.42.128.44:3000",
  credentials: true,
  exposedHeaders: ["Set-cookie"],
};

app.use(cors(corsOptions));

const port = process.env.PORT || 3001;

app.listen(port, () => {
  console.log(`Server running on ${port}`);
});

let connection;

async function connectToDatabase() {
  try {
    connection = await mysql.createConnection({
      user: process.env.DB_USERNAME,
      password: process.env.DB_PASSWORD,
      host: process.env.DB_HOST,
      port: process.env.DB_PORT,
      database: process.env.DB_DATABASE,
      sslmode: "REQUIRED",
      connectionLimit: 100,
    });
    console.log("Connected to the database");
  } catch (error) {
    console.error("Error connecting to the database:", error);
  }
}

connectToDatabase().catch((error) => {
  console.error("Failed to connect to database on startup:", error);
});

app.get("/api/ping", async (req, res) => {
  try {
    if (!connection) {
      await connectToDatabase();
    }

    res.status(200).json({ message: "Online" });
  } catch (error) {
    console.error("Error processing request:", error);
    res.status(500).json({ error: "An error occurred." });
  }
});

app.get("/api/library/", async (req, res) => {
  jwt.verify(
    req.cookies.authToken,
    user_secretkey,
    async function (err, decodedToken) {
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
    }
  );
});

function userLibrary(id) {
  const query =
    "SELECT userlibrary.currentPage, books.* FROM userlibrary JOIN books ON userlibrary.bookid = books.bookid WHERE userlibrary.userid = ?";

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

function getBookInfo(bookId) {
  const query = "SELECT * FROM bookinfo WHERE bookid = ?";

  return new Promise((resolve, reject) => {
    connection.query(query, [bookId], function (error, results) {
      if (error) {
        reject(error);
      } else {
        resolve(results);
      }
    });
  });
}

app.get(`/api/book`, async (req, res) => {
  try {
    const bookName = req.query.title;

    if (!bookName) {
      res.status(400).json({ error: "Something went wront" });
      return;
    }

    const [bookInfo] = await Promise.all([bookData(bookName)]);

    if (bookInfo.length === 0) {
      res.status(404).json({ message: "No book found" });
      return;
    }

    const authorInfo = await authorData(bookInfo[0].bookid);
    const bookInfoData = await getBookInfo(bookInfo[0].bookid);
    const bookRating = await getBookRating(bookInfo[0].bookid);

    // Ensure no sensitive data is included in the response
    res.json({
      data: bookInfo,
      author: authorInfo,
      bookInfoData: bookInfoData,
      rating: bookRating,
    });
  } catch (err) {
    console.error(err); // Log the error for debugging
    res.status(500).json({ error: "An internal server error occurred" });
  }
});

function getBookRating(bookId) {
  const query = "SELECT AVG(rating) AS rating FROM reviews WHERE bookid = ?";

  return new Promise((resolve, reject) => {
    connection.query(query, [bookId], function (error, results) {
      if (error) {
        reject(error);
      } else {
        resolve(results);
      }
    });
  });
}

function authorData(id) {
  const query = "SELECT author FROM books WHERE bookid = ?";

  return new Promise((resolve, reject) => {
    connection.query(query, [id], function (error, results) {
      if (error) {
        reject(error);
      } else {
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
          resolve(null);
        }
      }
    });
  });
}

function bookDataID(bookId) {
  const query = "SELECT * FROM lightnovelonline.books WHERE bookId = ?";

  return new Promise((resolve, reject) => {
    connection.query(query, [bookId], function (error, results) {
      if (error) {
        reject(error);
      } else {
        resolve(results);
      }
    });
  });
}

function bookData(bookName) {
  const query = "SELECT * FROM lightnovelonline.books WHERE title = ?";

  return new Promise((resolve, reject) => {
    connection.query(query, [bookName], function (error, results) {
      if (error) {
        reject(error);
      } else {
        resolve(results);
      }
    });
  });
}

function validateUserCredentials(data) {
  if (
    !data.email ||
    !data.username ||
    !data.password ||
    data === undefined ||
    data === null
  ) {
    return "Empty input fields";
  }

  if (!validator.isEmail(data.email)) {
    return "Invalid email";
  }

  if (!validator.isAlphanumeric(data.username)) {
    return "Invalid username";
  }

  if (data.username.length > 20) {
    return "Username is too long";
  }

  if (data.password.length < 5) {
    return "Password is too short";
  }

  if (data.password.length > 20) {
    return "Password is too long";
  }

  return "OK";
}

app.post("/api/createaccount", function (req, res) {
  try {
    const data = req.body;

    const validation = validateUserCredentials(data);
    if (validation !== "OK") {
      return res.json({ error: validation });
    }

    const email = validator.normalizeEmail(data.email);
    const username = validator.trim(data.username);
    const password = data.password;

    const currentDate = new Date().toISOString().split("T")[0];

    connection.query(
      "SELECT * FROM users WHERE userEmail = ? OR userName = ?",
      [email, username],
      function (error, results) {
        if (error) {
          console.error("Error executing query:", error);
          res.status(500).json({ error: "An error occurred." });
          return;
        }
        if (results.length > 0) {
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
          bcrypt.hash(password, 10, function (err, hashedPassword) {
            if (err) {
              console.error("Error hashing password:", err);
              res.status(500).json({ error: "An error occurred." });
              return;
            }
            const query =
              "INSERT INTO users (userName,userPassword,userEmail,dateCreated) VALUES (?,?,?,?)";
            connection.query(
              query,
              [username, hashedPassword, email, currentDate],
              function (error, results) {
                if (error) {
                  console.log(error);
                  res.status(500).json({ error: "An error occurred." });
                } else {
                  res.json({ message: "user created" });
                }
              }
            );
          });
        }
      }
    );
  } catch (err) {
    res.json({ error: "error" });
  }
});

app.post("/api/logIn", function (req, res) {
  try {
    const data = req.body;
    const username = data[0];
    const password = data[1];

    const query = "SELECT * FROM users WHERE userName = ?";
    connection.query(query, [username], function (error, results) {
      if (error) {
        res.status(500).json({ error: "An error occurred." });
        return;
      }
      if (results.length === 0) {
        res.json({ message: "no user exist" });
        return;
      }

      const user = results[0];
      bcrypt.compare(password, user.userPassword, function (err, result) {
        if (err) {
          console.error("Error comparing passwords:", err);
          res.status(500).json({ error: "An error occurred." });
          return;
        }

        if (result) {
          const userName = user.userName;
          const token = jwt.sign({ user: user.userid }, user_secretkey);
          res.cookie("authToken", token, {
            httpOnly: true,
            sameSite: "none",
            path: "/",
            expires: new Date(Date.now() + 1000 * 60 * 60 * 24 * 7),
            secure: true,
          });
          res.json({ message: "user exist", userName: userName, token: token });
        } else {
          res.json({ message: "no user exist" });
        }
      });
    });
  } catch (err) {
    res.json({ error: "error" });
  }
});

app.post("/api/removecookie", function (req, res) {
  res.clearCookie("authToken", { httpOnly: true });
  res.json({ success: true });
});

app.get("/api/protected", function (req, res) {
  try {
    if (!req.cookies.authToken) {
      res.json({ message: "no token" });
      return;
    }
    jwt.verify(req.cookies.authToken, user_secretkey, function (err, data) {
      if (err) {
        res.json({ message: "token invalid" });
      } else {
        res.json({
          message: "this is protected",
          data: data,
        });
      }
    });
  } catch (err) {
    res.json({ message: "error" });
  }
});

app.get("/api/latest", function (req, res) {
  try {
    const query =
      "SELECT books.bookid,books.title,books.bookcover,books.totalpages,AVG(reviews.rating) AS averageRating FROM books LEFT JOIN reviews ON reviews.bookid = books.bookid GROUP BY books.bookid,books.title,books.bookcover ORDER BY STR_TO_DATE(release_date, '%Y/%m/%d') DESC LIMIT 0,22;";

    connection.query(query, function (err, results) {
      if (err) {
        console.log(err);
        res.json({ error: "error" });
        return;
      }
      res.json({ books: results });
    });
  } catch (err) {
    res.json({ error: "error" });
  }
});

app.get("/api/novelsCreated", function (req, res) {
  jwt.verify(
    req.cookies.authToken,
    user_secretkey,
    async function (err, decodedToken) {
      if (err) {
        res.sendStatus(403);
      } else {
        try {
          const userID = decodedToken.user;
          const data = await usersNovels(userID);
          res.json({ data: data });
        } catch (err) {
          res.json({ error: "error" });
        }
      }
    }
  );
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

app.post("/api/AddToLibrary", function (req, res) {
  jwt.verify(
    req.cookies.authToken,
    user_secretkey,
    async function (err, decodedToken) {
      if (err) {
        res.sendStatus(403);
      } else {
        try {
          const userId = decodedToken.user;

          const query =
            "INSERT INTO userlibrary (userid,bookid,currentpage) VALUES (?,?,0)";

          connection.query(
            query,
            [userId, req.body.id],
            function (error, result) {
              if (error) {
                res.status(500).json({ error: "An error occurred." });
              } else {
                connection.query(
                  "UPDATE books SET totalinlibrary = COALESCE(totalinlibrary, 0) + 1 WHERE bookid = ?",
                  [req.body.id],
                  function (err, results) {
                    if (err) {
                      res.status(500).json({ error: "An error occurred." });
                    } else {
                      res.sendStatus(200);
                    }
                  }
                );
              }
            }
          );
        } catch (err) {
          res.status(500).json({ error: "An error occurred." });
        }
      }
    }
  );
});

app.delete("/api/RemoveFromLibrary", function (req, res) {
  jwt.verify(
    req.cookies.authToken,
    user_secretkey,
    async function (err, decodedToken) {
      if (err) {
        res.sendStatus(403);
      } else {
        try {
          const userId = decodedToken.user;
          const bookId = req.body.id;

          const query =
            "DELETE FROM userlibrary WHERE bookid = ? AND userid = ? ";

          connection.query(query, [bookId, userId], function (error, results) {
            if (error) {
              res.status(500).json({ error: "An error occurred." });
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
        } catch (err) {
          res.json({ error: "error" });
        }
      }
    }
  );
});

app.post("/api/checkLibrary", function (req, res) {
  if (
    req.cookies.authToken === null ||
    req.cookies.authToken === "null" ||
    req.cookies.authToken === "undefined" ||
    req.cookies.authToken === undefined
  ) {
    res.json({ message: "no token" });
    return;
  }
  jwt.verify(
    req.cookies.authToken,
    user_secretkey,
    function (err, decodedToken) {
      try {
        if (err) {
          res.sendStatus(403);
        } else {
          const userid = decodedToken.user;
          const bookid = req.body.id;

          const query =
            "SELECT currentpage FROM userlibrary WHERE userid = ? AND bookid = ?";
          connection.query(query, [userid, bookid], function (error, results) {
            if (error) {
              res.status(500).json({ error: "An error occurred." });
            } else {
              if (results.length > 0) {
                res.json({
                  message: "exist",
                  currentPage: results[0].currentpage,
                });
              } else {
                res.json({ message: "does not exist" });
              }
            }
          });
        }
      } catch (err) {
        res.json({ error: "error" });
      }
    }
  );
});

app.post("/api/BooksBasedOnSearch", function (req, res) {
  try {
    const input = req.body.data;

    const query = "SELECT * FROM books WHERE title LIKE ? LIMIT 10";
    const searchTerm = `%${input}%`;

    connection.query(query, [searchTerm], function (err, results) {
      if (err) {
        res.json({ error: "error" });
      } else if (results.length > 0) {
        res.json({ books: results });
      } else {
        res.json({ empty: "No books" });
      }
    });
  } catch (err) {
    res.json({ error: "error" });
  }
});

app.post("/api/createNewBook", function (req, res) {
  jwt.verify(
    req.cookies.authToken,
    user_secretkey,
    function (err, decodedToken) {
      if (err) {
        return res.sendStatus(403);
      }
      try {
        const userId = decodedToken.user;
        const data = req.body;

        const checkData = checkIfDataCorrect(data);
        if (checkData !== "OK") {
          return res.json({ error: checkData });
        }

        connection.query(
          "SELECT * FROM books WHERE author = ?",
          [userId],
          function (err, results) {
            if (err) {
              return res.sendStatus(500);
            }

            if (results.length >= 10) {
              return res.json({ message: "Maximum of 10 books allowed" });
            }

            // Check if a book with the same title or synopsis exists
            const checkQuery =
              "SELECT * FROM books WHERE title = ? OR bookid IN (SELECT bookid FROM bookinfo WHERE synopsis = ?)";
            connection.query(
              checkQuery,
              [data.bookTitle, data.Synopsis],
              function (err, results) {
                if (err) {
                  return res.sendStatus(500);
                }

                if (results.length > 0) {
                  if (results[0].title === data.bookTitle) {
                    return res.json({ message: "Title exists" });
                  } else {
                    return res.json({ message: "Synopsis exists" });
                  }
                }

                const currentDate = new Date().toISOString().split("T")[0];
                const authorid = userId;

                // Neither title nor synopsis exists, so proceed to insert the new book
                const insertBookQuery =
                  "INSERT INTO books (title, bookcover, release_date, author) VALUES (?, ?, ?, ?)";
                connection.query(
                  insertBookQuery,
                  [data.bookTitle, data.picture, currentDate, userId],
                  function (err, insertResult) {
                    if (err) {
                      return res.sendStatus(500);
                    }

                    const insertBookInfoQuery =
                      "INSERT INTO bookinfo (bookid, synopsis, genres, language, tags, warnings, authorid) VALUES (?, ?, ?, ?, ?, ?, ?)";
                    connection.query(
                      insertBookInfoQuery,
                      [
                        insertResult.insertId,
                        data.Synopsis,
                        data.inputGenre,
                        data.Language,
                        data.Tags,
                        data.Warnings,
                        authorid,
                      ],
                      function (err, results) {
                        if (err) {
                          return res.json({ error: "Something went wrong" });
                        } else {
                          return res.json({ message: "New book inserted" });
                        }
                      }
                    );
                  }
                );
              }
            );
          }
        );
      } catch (err) {
        return res.json({ error: "Something went wrong" });
      }
    }
  );
});

function checkIfDataCorrect(data) {
  const genresList = [
    "Select",
    "Mystery",
    "Romance",
    "Science Fiction",
    "Fantasy",
    "Thriller",
    "Historical Fiction",
    "Non-Fiction",
    "Biography",
    "Self-Help",
    "Horror",
    "Adventure",
    "Dystopian",
    "Young Adult",
    "Memoir",
    "Comedy",
    "Sport",
    "Games",
  ];

  const warningList = [
    "For everyone",
    "PG-13",
    "Guardian guidance recommended",
    "18+",
  ];

  const requiredFields = [
    "bookTitle",
    "Synopsis",
    "inputGenre",
    "Language",
    "Tags",
    "Warnings",
  ];
  const missingFields = requiredFields.filter((field) => !data[field]);

  if (missingFields.length > 0) {
    return `Missing fields: ${missingFields.join(", ")}`;
  }

  if (data.Synopsis.length > 700) {
    return "Synopsis exceeds maximum length of 700 characters";
  }

  if (data.bookTitle.length > 20) {
    return "Title exceeds maximum length of 20 characters";
  }

  if (!genresList.some((genre) => data.inputGenre.includes(genre))) {
    return "Only one genre is allowed";
  }

  if (!warningList.some((warning) => data.Warnings.includes(warning))) {
    return "Only one warning is allowed";
  }

  if (data.Language.split(" ").length > 10 || data.Language.length > 25) {
    return "Only one language is allowed";
  }

  const tagWords = data.Tags.split(" ");
  if (tagWords.length > 3 || tagWords.length < 1) {
    return "Maximum of three words is allowed in tags";
  }

  if (data.picture.split(" ").length > 1) {
    return "Only one picture is allowed";
  }

  return "OK";
}

app.get("/api/ranking", function (req, res) {
  try {
    const type = req.query.type;
    let query;
    if (type === "overall") {
      query = `SELECT b.bookid, b.title, b.bookcover, AVG(r.rating) AS average_rating
      FROM books b
      LEFT JOIN reviews r ON b.bookid = r.bookid
      GROUP BY b.bookid, b.title, b.bookcover
      ORDER BY b.totalinlibrary DESC, average_rating DESC
      LIMIT 50;`;
    } else if (type === "collections") {
      query = `SELECT b.bookid, b.title, b.bookcover, AVG(r.rating) AS average_rating
      FROM books b
      LEFT JOIN reviews r ON b.bookid = r.bookid
      GROUP BY b.bookid, b.title, b.bookcover
      ORDER BY b.totalinlibrary DESC
      LIMIT 50;`;
    } else if (type === "rating") {
      query = `
        SELECT books.bookid, books.title,books.bookcover, AVG(reviews.rating) AS average_rating
        FROM books
        INNER JOIN reviews ON books.bookid = reviews.bookid
        GROUP BY books.bookid, books.title,books.bookcover
        ORDER BY average_rating DESC
        LIMIT 50;
        `;
    } else {
      return res.json({ error: "error" });
    }

    connection.query(query, function (err, results) {
      if (err) {
        console.log(err);
        res.json({ error: "error" });
      } else {
        if (results.length > 0) {
          res.json({ books: results });
        } else {
          res.json({ message: "No books found" });
        }
      }
    });
  } catch (err) {
    res.json({ error: "error" });
  }
});

app.get("/api/authorInfo", function (req, res) {
  const author = req.query.authorName;

  const query = "SELECT userid FROM lightnovelonline.users WHERE userName = ?";

  connection.query(query, [author], function (err, results) {
    if (err) {
      res.status(500).json({ error: "An error occurred." });
    } else {
      try {
        if (results.length === 0) {
          res.json({ message: "no author found" });
          return;
        }

        const authorId = results[0].userid;

        const query = `
          SELECT *
          FROM lightnovelonline.books AS b
          JOIN lightnovelonline.bookinfo AS bi ON b.bookid = bi.bookid
          WHERE b.author = ?;
        `;
        connection.query(query, [authorId], function (err, results) {
          if (err) {
            res.status(500).json({ error: "An error occurred." });
          } else {
            res.json({ books: results });
          }
        });
      } catch (err) {
        res.json({ message: "error" });
      }
    }
  });
});

app.post("/api/admin/login", function (req, res) {
  const query =
    "SELECT * FROM lightnovelonline.admins WHERE adminName = ? AND adminPassword = ?";

  connection.query(query, [req.body[0], req.body[1]], function (err, results) {
    if (err) {
      res.status(500).json({ error: "An error occurred." });
    } else {
      try {
        if (results === undefined) {
          res.json({ message: "error" });
          return;
        }
        if (results.length > 0) {
          const token = jwt.sign(
            { admin: results[0].adminid },
            admin_secretkey
          );
          res.json({ message: "success", token: token });
        } else {
          res.json({ message: "fail" });
        }
      } catch (err) {
        res.json({ message: "error" });
      }
    }
  });
});

app.get("/api/admin/access", function (req, res) {
  jwt.verify(req.cookies.authToken, admin_secretkey, function (err, decoded) {
    try {
      if (err) {
        res.json({ message: "error" });
      } else {
        res.json({ message: "success" });
      }
    } catch (err) {
      res.json({ message: "error" });
    }
  });
});

app.post("/api/checkOwnerOfBook", function (req, res) {
  jwt.verify(
    req.cookies.authToken,
    user_secretkey,
    async function (err, decodedToken) {
      if (err) {
        res.sendStatus(403);
      } else {
        try {
          const userId = decodedToken.user;
          const bookTitle = req.body.bookName.replaceAll("-", " ");

          const query =
            "SELECT author, bookid,totalpages FROM lightnovelonline.books WHERE title = ?";
          connection.query(query, [bookTitle], function (err, results) {
            if (err) {
              res.status(500).json({ error: "An error occurred." });
            } else {
              if (results.length === 0) {
                res.json({ message: "invalid" });
                return;
              }
              if (results[0].author === userId) {
                res.json({
                  message: "valid",
                  bookId: results[0].bookid,
                  totalpages: results[0].totalpages,
                });
              } else {
                res.json({ message: "invalid" });
                return;
              }
            }
          });
        } catch (err) {
          res.json({ error: "error" });
        }
      }
    }
  );
});

app.get("/api/getBookInfo", function (req, res) {
  jwt.verify(
    req.cookies.authToken,
    user_secretkey,
    async function (err, decodedToken) {
      if (err) {
        res.sendStatus(403);
      }
      try {
        const bookId = req.query.id;

        bookDataID(bookId).then((results) => {
          res.json({ data: results });
        });
      } catch (err) {
        res.json({ error: "error" });
      }
    }
  );
});

app.post("/api/publishChapter", function (req, res) {
  jwt.verify(
    req.cookies.authToken,
    user_secretkey,
    async function (err, decodedToken) {
      if (err) {
        res.sendStatus(403);
      }
      try {
        const bookId = req.body.bookId;
        const chapterContent = req.body.chapterContent;
        const currentChapter = req.body.chapterNumber;
        const chapterTitle = req.body.chapterTitle;

        connection.query(
          "SELECT * FROM chapters WHERE bookid = ?",
          [bookId],
          function (err, results) {
            if (err) {
              res.status(500).json({ error: "An error occurred." });
            } else {
              if (results.length > 5000) {
                res.json({ message: "To many chapters" });
                return;
              }
            }
          }
        );

        if (chapterContent.length > 50000) {
          res.json({ error: "To long chapter" });
          return;
        } else if (chapterContent.length < 2500) {
          res.json({ error: "To short chapter" });
          return;
        }
        if (chapterTitle.length > 25) {
          res.json({ error: "To long title" });
          return;
        } else if (chapterTitle.length < 1) {
          res.json({ error: "To short title" });
          return;
        }

        const query =
          "INSERT INTO chapters (bookid,chapterNumber,chapterText,chapterTitle) VALUES (?,?,?,?)";

        connection.query(
          query,
          [bookId, currentChapter, chapterContent, chapterTitle],
          function (err, results) {
            if (err) {
              res.json({ message: "error" });
            } else {
              if (addChapterNumber(bookId, currentChapter) === "Error") {
                res.json({ message: "error" });
              } else {
                res.json({ message: "success" });
              }
            }
          }
        );
      } catch (err) {
        res.json({ message: "error" });
      }
    }
  );
});

function addChapterNumber(bookId, chapterNumber) {
  const query = "UPDATE books SET totalpages = ? WHERE bookid = ?";
  try {
    connection.query(query, [chapterNumber, bookId], function (err, results) {
      if (err) {
        return "Error";
      } else {
        return "Success";
      }
    });
  } catch (err) {
    return "Error";
  }
}

app.get("/api/chapters/:bookName", async (req, res) => {
  const { bookName } = req.params;

  try {
    const chapters = await fetchChaptersFromDataSource(bookName);

    if (chapters === "Error") {
      res.status(500).json({ message: "Internal server error" });
      return;
    }

    res.json({ data: chapters });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
  }
});

function fetchChaptersFromDataSource(bookName) {
  return new Promise((resolve, reject) => {
    connection.query(
      "SELECT bookid FROM books WHERE title = ?",
      [bookName],
      function (err, results) {
        if (err) {
          reject("Error");
        } else {
          const bookId = results[0].bookid;
          const query =
            "SELECT chapterNumber, chapterTitle,chapterText FROM chapters WHERE bookid = ?";
          connection.query(query, [bookId], function (err, results) {
            if (err) {
              reject("Error");
            } else {
              resolve(results);
            }
          });
        }
      }
    );
  });
}

app.post("/api/chapterInfo", function (req, res) {
  jwt.verify(
    req.cookies.authToken,
    user_secretkey,
    async function (err, decodedToken) {
      if (err) {
      }
      try {
        const bookName = req.body.bookName.replaceAll("%20", " ");
        const chapterNumber = req.body.chapterNumber;

        connection.query(
          "SELECT bookid,totalpages FROM books WHERE title = ?",
          [bookName],
          function (err, results) {
            if (err) {
              res.json({ error: "error" });
            }

            if (results.length === 0) {
              res.json({ message: "No book found" });
              return;
            }

            const bookId = results[0].bookid;
            const totalPages = results[0].totalpages;

            const query =
              "SELECT chapterText,chapterTitle FROM chapters WHERE bookid = ? AND chapterNumber = ?";
            connection.query(
              query,
              [bookId, chapterNumber],
              function (err, results) {
                if (err) {
                  res.json({ error: "error" });
                } else {
                  if (results.length > 0) {
                    res.json({ data: results, totalPages: totalPages });
                  } else {
                    res.json({ message: "Nothing found" });
                  }
                }
              }
            );
          }
        );
      } catch (err) {
        res.json({ error: "error" });
      }
    }
  );
});

app.post("/api/setLatestReadChapter", function (req, res) {
  jwt.verify(
    req.cookies.authToken,
    user_secretkey,
    async function (err, decodedToken) {
      if (err) {
        return res.sendStatus(403);
      }
      try {
        const bookName = req.body.bookName;
        const chapterNumber = req.body.chapterNumber;
        const totalPages = req.body.totalPages;

        if (totalPages >= chapterNumber) {
          connection.query(
            "SELECT bookid FROM books WHERE title = ?",
            [bookName],
            function (err, results) {
              if (err) {
                res.json({ error: "error" });
              }
              const bookId = results[0].bookid;

              const query =
                "UPDATE userlibrary SET currentPage = ? WHERE bookid = ? AND userid = ?";
              connection.query(
                query,
                [chapterNumber, bookId, decodedToken.user],
                function (err, results) {
                  if (err) {
                    res.json({ error: "error" });
                  } else {
                    res.json({ message: "success" });
                  }
                }
              );
            }
          );
        }
      } catch (err) {
        res.json({ error: "error" });
      }
    }
  );
});

app.get("/api/comments", function (req, res) {
  jwt.verify(
    req.cookies.authToken,
    user_secretkey,
    async function async(err, decodedToken) {
      try {
        const bookId = req.query.bookid;
        const loadSet = Number(req.query.loadSet);
        let userId;
        if (req.cookies.authToken !== undefined) {
          userId = decodedToken.user;
        }

        if (!bookId) {
          return res.status(400).json({ error: "bookId is required" });
        }

        if (typeof bookId !== "string") {
          return res.status(400).json({ error: "bookId must be a string" });
        }

        let userName;
        let likedAndDislikedComments;

        if (userId !== undefined) {
          const query = "SELECT userName FROM users WHERE userid = ?";
          connection.query(query, [userId], function (error, results) {
            if (error) {
              return res.status(500).json({ error: "Database error" });
            }
            if (results.length > 0) {
              userName = results[0].userName;
            }
          });
          likedAndDislikedComments = await fetchLikedAndDislikedComments(
            userId
          );
        }

        const amountOfComments = 9;

        let maxLimit = loadSet + 1 * amountOfComments;
        let minLimit;
        if (loadSet > 0) {
          minLimit = loadSet * amountOfComments - 1;
        } else {
          minLimit = loadSet * amountOfComments;
        }

        const query = `
        SELECT 
          comments.comment, 
          COALESCE(comments.dislikes, 0) AS dislikes, 
          COALESCE(comments.likes, 0) AS likes, 
          IFNULL(users.userName, 'Deleted User') AS userName, 
          comments.commentid,
          (COALESCE(comments.likes, 0) - COALESCE(comments.dislikes, 0) / 2) AS likesDislikes
        FROM comments
        LEFT JOIN users ON comments.userid = users.userid
        WHERE comments.bookid = ? AND DELETED = 0 AND relatedTo = 0
        ORDER BY likesDislikes DESC
        LIMIT ? , ?;
      `;

        connection.query(
          query,
          [bookId, minLimit, maxLimit],
          function (error, results) {
            if (error) {
              return res.status(500).json({ error: "Database error" });
            }
            if (results.length > 0) {
              if (
                userName !== undefined &&
                results.length === amountOfComments
              ) {
                results.pop();
                return res.json({
                  comments: results,
                  userName: userName,
                  likedAndDislikedComments: likedAndDislikedComments,
                  moreComments: true,
                });
              } else if (
                userName !== undefined &&
                results.length < amountOfComments
              ) {
                return res.json({
                  comments: results,
                  userName: userName,
                  likedAndDislikedComments: likedAndDislikedComments,
                  moreComments: false,
                });
              }
              return res.json({ comments: results });
            } else {
              return res.json({ noComment: "No comments found" });
            }
          }
        );
      } catch (err) {
        return res.status(500).json({ error: "Unknown error" });
      }
    }
  );
});

function fetchLikedAndDislikedComments(userId) {
  const query =
    "SELECT commentid, feedback FROM commentfeedback WHERE userid = ?";

  return new Promise((resolve, reject) => {
    connection.query(query, [userId], function (error, results) {
      if (error) {
        reject(error);
      } else {
        resolve(results);
      }
    });
  });
}

app.post("/api/postComment", function (req, res) {
  jwt.verify(
    req.cookies.authToken,
    user_secretkey,
    async function (err, decodedToken) {
      if (err) {
        return res.json({ message: "Not logged in" });
      }

      try {
        const bookId = req.body.bookid;
        const comment = req.body.comment;
        const userId = decodedToken.user;

        if (!bookId) {
          return res.json({ message: "Something went wrong" });
        }
        if (comment.length > 1500) {
          return res.json({ message: "Comment is to long" });
        } else if (comment.lenght < 1) {
          return res.json({ message: "Comment is to short" });
        }

        const query =
          "INSERT INTO comments (userid, bookid, comment,DELETED,relatedTo) VALUES (?, ?, ?,0,0)";
        connection.query(
          query,
          [userId, bookId, comment],
          function (error, results) {
            if (error) {
              return res.json({ error: "database error" });
            }
            return res.json({ message: "Commented posted" });
          }
        );
      } catch (err) {
        return res.json({ message: "Something went wrong" });
      }
    }
  );
});

app.post("/api/commentFeedback", function (req, res) {
  jwt.verify(
    req.cookies.authToken,
    user_secretkey,
    async function (err, decodedToken) {
      if (err) {
        return res.sendStatus(403);
      }
      try {
        const commentId = req.body.commentId;
        const feedback = req.body.feedback;
        const userId = decodedToken.user;

        const insertFeedback = await insertCommentFeedback(
          userId,
          commentId,
          feedback
        );
        if (insertFeedback === "Error") {
          return res.json({ error: "Database error" });
        }

        if (insertFeedback === "Already given feedback") {
          return res.json({ message: "Already given feedback" });
        }

        if (feedback === "dislikes") {
          let query;
          if (insertFeedback === "New") {
            query =
              "UPDATE comments SET dislikes = Coalesce(dislikes,0) + 1 WHERE commentid = ?";
          } else if (insertFeedback === "Updated") {
            query =
              "UPDATE comments SET dislikes = Coalesce(dislikes,0) + 1, likes = likes - 1 WHERE commentid = ?";
          } else if (insertFeedback === "Deleted") {
            query =
              "UPDATE comments SET dislikes = dislikes - 1 WHERE commentid = ?";
          }

          connection.query(query, [commentId], function (error, results) {
            if (error) {
              return res.json({ error: "database error" });
            }
            return res.json({
              message: "Feedback posted",
              insertedType: insertFeedback,
            });
          });
        } else {
          let query;
          if (insertFeedback === "New") {
            query =
              "UPDATE comments SET likes = Coalesce(likes, 0) + 1 WHERE commentid = ?";
          } else if (insertFeedback === "Updated") {
            query =
              "UPDATE comments SET likes = Coalesce(likes, 0) + 1, dislikes = dislikes - 1 WHERE commentid = ?";
          } else if (insertFeedback === "Deleted") {
            query = "UPDATE comments SET likes = likes - 1 WHERE commentid = ?";
          }

          connection.query(query, [commentId], function (error, results) {
            if (error) {
              return res.json({ error: "database error" });
            }
            return res.json({
              message: "Feedback posted",
              insertedType: insertFeedback,
            });
          });
        }
      } catch (err) {
        return res.json({ error: "Something went wrong" });
      }
    }
  );
});

async function insertCommentFeedback(userId, commentId, feedback) {
  return new Promise((resolve, reject) => {
    const checkQuery =
      "SELECT feedback FROM commentfeedback WHERE userid = ? AND commentid = ?";

    connection.query(
      checkQuery,
      [userId, commentId],
      function (error, results) {
        if (error) {
          reject("Error");
        }

        if (results.length === 0) {
          const insertQuery =
            "INSERT INTO commentfeedback (userid, commentid, feedback) VALUES (?, ?, ?)";
          connection.query(
            insertQuery,
            [userId, commentId, feedback],
            function (error, results) {
              if (error) {
                reject("Error");
              }
              resolve("New");
            }
          );
        }
        // If feedback for this user and comment already exists, update it
        else if (results.length > 0 && results[0].feedback !== feedback) {
          const updateQuery =
            "UPDATE commentfeedback SET feedback = ? WHERE userid = ? AND commentid = ?";
          connection.query(
            updateQuery,
            [feedback, userId, commentId],
            function (error, results) {
              if (error) {
                reject("Error");
              }
              resolve("Updated");
            }
          );
        } else {
          const updateQuery =
            "DELETE FROM commentfeedback WHERE userid = ? AND commentid = ?";
          connection.query(updateQuery, [userId, commentId], function (error) {
            if (error) {
              reject("Error");
            }
            resolve("Deleted");
          });
        }
      }
    );
  });
}

app.delete("/api/deleteAccount", function (req, res) {
  try {
    jwt.verify(
      req.cookies.authToken,
      user_secretkey,
      async function (err, decodedToken) {
        if (err) {
          return res.sendStatus(403);
        }
        const userId = decodedToken.user;
        const query = "DELETE FROM users WHERE userid = ?";
        connection.query(query, [userId], function (error, results) {
          if (error) {
            return res.json({ error: "error" });
          }
          return res.json({ message: "Account deleted" });
        });
      }
    );
  } catch (err) {
    return res.json({ error: "error" });
  }
});

app.get("/api/getUserInfo", function (req, res) {
  try {
    jwt.verify(
      req.cookies.authToken,
      user_secretkey,
      function (err, decodedToken) {
        if (err) {
          return res.sendStatus(403);
        }
        const userId = decodedToken.user;
        const query =
          "SELECT userName, userEmail, dateCreated FROM users WHERE userid = ?";
        connection.query(query, [userId], function (error, results) {
          if (error) {
            return res.json({ error: "error" });
          }
          if (results.length > 0) {
            const userDetails = results[0];
            const query = "SELECT COUNT(author) FROM books WHERE author = ?";
            connection.query(query, [userId], function (error, results) {
              if (error) {
                console.log(error);
                return res.json({ error: "error" });
              }
              if (results.length > 0) {
                const booksCreated = results[0]["COUNT(author)"];
                return res.json({
                  userData: userDetails,
                  books: booksCreated,
                  message: "success",
                });
              }
            });
          } else {
            return res.json({ error: "No data found" });
          }
        });
      }
    );
  } catch (err) {
    return res.json({ error: "error" });
  }
});

app.get("/api/getUsersComments", function (req, res) {
  try {
    jwt.verify(
      req.cookies.authToken,
      user_secretkey,
      function (err, decodedToken) {
        if (err) {
          return res.sendStatus(403);
        }

        const loadSet = Number(req.query.loadSet);

        const amountOfComments = 11;

        let maxLimit = loadSet + 1 * amountOfComments;
        let minLimit;
        if (loadSet > 0) {
          minLimit = loadSet * amountOfComments - 1;
        } else {
          minLimit = loadSet * amountOfComments;
        }

        const userId = decodedToken.user;
        const query = `SELECT comments.comment, comments.bookid, books.title FROM comments LEFT JOIN books ON 
          comments.bookid = books.bookid WHERE userid = ? AND DELETED = 0 ORDER BY comments.commentid DESC LIMIT ?,?`;
        connection.query(
          query,
          [userId, minLimit, maxLimit],
          function (error, results) {
            if (error) {
              return res.json({ error: "error" });
            } else if (results.length > 0) {
              if (results.length === amountOfComments) {
                results.pop();
                return res.json({ comments: results, moreComments: true });
              } else {
                return res.json({ comments: results, moreComments: false });
              }
            } else {
              return res.json({ message: "No comments found" });
            }
          }
        );
      }
    );
  } catch (err) {
    return res.json({ error: "error" });
  }
});

app.get("/api/getRatingAndInfo", function (req, res) {
  try {
    jwt.verify(
      req.cookies.authToken,
      user_secretkey,
      async function (err, decodedToken) {
        const bookName = req.query.bookName;
        const getBookIdQuery =
          "SELECT bookid,bookcover FROM books WHERE title = ?";
        connection.query(
          getBookIdQuery,
          [bookName],
          async function (error, results) {
            if (error) {
              return res.json({ error: "error" });
            } else if (results.length > 0) {
              const bookId = results[0].bookid;
              const bookCover = results[0].bookcover;
              const userId = decodedToken.user;

              let userName;

              if (userId !== undefined) {
                const query = "SELECT userName FROM users WHERE userid = ?";
                connection.query(query, [userId], function (error, results) {
                  if (error) {
                    return res.status(500).json({ error: "Database error" });
                  }
                  if (results.length > 0) {
                    userName = results[0].userName;
                  }
                });
              }

              try {
                const response = await getBookReviews(bookId);
                if (response === "No reviews found") {
                  return res.json({
                    message: "No reviews found",
                    bookCover: bookCover,
                  });
                } else if (response === "Error") {
                  return res.json({ error: "error getting reviews" });
                }
                return res.json({
                  message: "success",
                  data: response,
                  bookCover: bookCover,
                  userName: userName,
                });
              } catch (error) {
                return res.json({ error: "error getting reviews" });
              }
            } else {
              return res.json({ message: "No data found" });
            }
          }
        );
      }
    );
  } catch (err) {
    return res.json({ error: "error" });
  }
});

function getBookReviews(id) {
  return new Promise((resolve, reject) => {
    const query =
      "SELECT reviews.rating, reviews.text, reviews.userid,users.userName FROM reviews LEFT JOIN users on users.userid = reviews.userid WHERE bookid = ?";
    connection.query(query, [id], function (error, results) {
      if (error) {
        reject("Error");
      } else if (results.length > 0) {
        resolve(results);
      } else {
        resolve("No reviews found");
      }
    });
  });
}

app.post("/api/postReview", function (req, res) {
  try {
    jwt.verify(
      req.cookies.authToken,
      user_secretkey,
      async function (err, decodedToken) {
        if (err) {
          return res.json({ error: "no token" });
        }
        const userId = decodedToken.user;

        const validation = validateUserReview(req.body);
        if (validation !== "OK") {
          return res.json({ error: validation });
        }
        const getBookIdQuery = "SELECT bookid FROM books WHERE title = ?";

        connection.query(
          getBookIdQuery,
          [req.body.bookName],
          function (error, results) {
            if (error) {
              return res.json({ error: "error" });
            } else if (results.length > 0) {
              const bookId = results[0].bookid;
              const checkIfUserHasReviewd =
                "SELECT * FROM reviews WHERE bookid = ? AND userid = ?";
              connection.query(
                checkIfUserHasReviewd,
                [bookId, userId],
                async function (error, results) {
                  if (error) {
                    return res.json({ error: "error" });
                  } else if (results.length === 0) {
                    const insertQuery =
                      "INSERT INTO reviews (bookid, userid, rating, text) VALUES (?, ?, ?, ?)";
                    connection.query(
                      insertQuery,
                      [bookId, userId, req.body.rating, req.body.review],
                      function (error, results) {
                        if (error) {
                          return res.json({ error: "error" });
                        } else {
                          return res.json({ message: "Review posted" });
                        }
                      }
                    );
                  } else {
                    return res.json({ message: "User has reviewed already" });
                  }
                }
              );
            } else {
              return res.json({ message: "No data found" });
            }
          }
        );
      }
    );
  } catch (err) {
    return res.json({ error: "error" });
  }
});

function validateUserReview(data) {
  try {
    if (
      data.rating === undefined ||
      data.review === undefined ||
      data.bookName === undefined
    ) {
      return "Missing fields";
    } else if (data.rating > 5 || data.rating < 1) {
      return "Invalid rating";
    } else if (data.review.length > 2000) {
      return "Review is too long";
    } else if (data.review.length < 3) {
      return "Review is too short";
    } else {
      return "OK";
    }
  } catch (err) {
    return "Error";
  }
}

app.get("/api/getUsersReviews", function (req, res) {
  try {
    jwt.verify(
      req.cookies.authToken,
      user_secretkey,
      function (err, decodedToken) {
        if (err) {
          return res.sendStatus(403);
        }

        const loadSet = Number(req.query.loadSet);

        const amountOfComments = 11;

        let maxLimit = loadSet + 1 * amountOfComments;
        let minLimit;
        if (loadSet > 0) {
          minLimit = loadSet * amountOfComments - 1;
        } else {
          minLimit = loadSet * amountOfComments;
        }

        const userId = decodedToken.user;
        const query = `SELECT books.title, reviews.rating, reviews.text FROM reviews LEFT JOIN books ON 
        reviews.bookid = books.bookid WHERE reviews.userid = ? ORDER BY reviews.reviewid DESC LIMIT ?,?`;

        connection.query(
          query,
          [userId, minLimit, maxLimit],
          function (error, results) {
            if (error) {
              return res.json({ error: "error" });
            } else if (results.length > 0) {
              if (results.length === amountOfComments) {
                results.pop();
                return res.json({ reviews: results, moreReviews: true });
              } else {
                return res.json({ reviews: results, moreReviews: false });
              }
            } else {
              return res.json({ message: "No reviews found" });
            }
          }
        );
      }
    );
  } catch (err) {
    return res.json({ error: "error" });
  }
});

app.delete("/api/deleteComment", function (req, res) {
  try{
    jwt.verify(
      req.cookies.authToken,
      user_secretkey,
      function (err, decodedToken) {
        if (err) {
          return res.sendStatus(403);
        }
        const userId = decodedToken.user;
        const commentId = req.body.commentId;
  
        const query =
          "UPDATE comments SET DELETED = 1 WHERE userid = ? AND commentid = ?";
  
        connection.query(query, [userId, commentId], function (error, results) {
          if (error) {
            console.log(error);
            return res.json({ error: "error" });
          }
          return res.json({ message: "Comment deleted" });
        });
      }
    );
  }catch(err){
    return res.json({ error: "error" });
  }
});

app.delete("/api/deleteReview", function (req, res) {
  try {
    jwt.verify(
      req.cookies.authToken,
      user_secretkey,
      function (err, decodedToken) {
        if (err) {
          return res.sendStatus(403);
        }
        const userId = decodedToken.user;
        const bookName = req.body.bookName;

        const query =
          "DELETE FROM reviews WHERE userid = ? AND bookid = (SELECT bookid FROM books WHERE title = ?)";
        connection.query(query, [userId, bookName], function (error, results) {
          if (err) {
            return res.json({ error: "error" });
          }
          return res.json({ message: "Review deleted" });
        });
      }
    );
  } catch (err) {
    return res.json({ error: "error" });
  }
});

app.post("/api/replyToComment", function (req, res) {
  try{
    jwt.verify(
      req.cookies.authToken,
      user_secretkey,
      function (err, decodedToken) {
        if (err) {
          console.log(err);
          return res.sendStatus(403);
        }
        const userId = decodedToken.user;
        const commentId = req.body.commentId;
        const reply = req.body.replyText;
        const bookId = req.body.bookId;
  
        const checkReplies = "SELECT commentid from comments WHERE userid = ? and relatedTo = ? and comment = ? AND DELETED = 0";
  
        connection.query(checkReplies, [userId, commentId, reply], function (error, results) {
          if (error) {
            console.log(error);
            return res.json({ error: "error" });
          }
          if (results.length > 0) {
            return res.json({ reply: "Already replied" });
          }

          if (
            commentId === undefined ||
            reply === undefined ||
            commentId === "" ||
            reply === "" ||
            commentId === null ||
            reply === null
          ) {
            return res.json({ reply: "Missing fields" });
          }
          if (reply.length > 500) {
            return res.json({ reply: "Reply is too long" });
          }
          if (reply.length < 1) {
            return res.json({ reply: "Reply is too short" });
          }
    
          const query =
            "INSERT INTO comments (userid, comment,relatedTo,bookid,DELETED) VALUES (?, ?, ?,?,0)";
    
          connection.query(
            query,
            [userId, reply, commentId,bookId],
            function (error, results) {
              if (error) {
                console.log(error);
                return res.json({ error: "error" });
              }
              return res.json({ message: "Reply posted" });
            }
          );
        });
      }
    );
  }catch(err){
    return res.json({ error: "error" });
  }
});

app.get("/api/getReplies", function (req, res) {
  try{
    const bookId = req.query.bookId;

  if (bookId === undefined || bookId === "") {
    return res.json({ error: "Missing fields" });
  }

  const query =
    `SELECT comments.comment, comments.likes, comments.dislikes, comments.relatedTo, users.userName 
    FROM comments 
    LEFT JOIN users ON users.userid = comments.userid 
    WHERE bookid = ? AND DELETED = 0 AND relatedTo != 0;`;

  connection.query(query, [bookId], function (error, results) {
    if (error) {
      return res.json({ error: "error" });
    }
    if (results.length > 0) {
      return res.json({ replies: results });
    } else {
      return res.json({ message: "No replies found" });
    }
  });
  }catch(err){
    return res.json({ error: "error" });
  }
});

app.delete("/api/deleteReply",function(req,res){
  try{
    jwt.verify(
      req.cookies.authToken,
      user_secretkey,
      function (err, decodedToken) {
        if (err) {
          return res.sendStatus(403);
        }
        if (req.body.commentId === undefined || req.body.commentId === "") {
          return res.json({ error: "Missing fields" });
        }
        if (req.body.replyUser === undefined || req.body.replyUser === "") {
          return res.json({ error: "Missing fields" });
        }
        if (req.body.replyText === undefined || req.body.replyText === "") {
          return res.json({ error: "Missing fields" });
        }
        const replyText = req.body.replyText;
        const commentId = req.body.commentId;
        const replyUser = req.body.replyUser;
  
        const query =
          "UPDATE comments SET DELETED = 1 WHERE userid = (SELECT userid FROM users WHERE userName = ?) AND relatedTo = ? AND comment = ?";
  
        connection.query(query, [replyUser,commentId,replyText], function (error, results) {
          if (error) {
            console.log(error);
            return res.json({ error: "error" });
          }
          return res.json({ message: "Reply deleted" });
        });
      }
    );
  }catch(err){
    return res.json({ error: "error" });
  }
})

module.exports = app;
