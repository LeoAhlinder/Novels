const express = require("express");
const app = express();
const bodyParser = require("body-parser");
const path = require("path");
const mysql = require("mysql2");
const { error, Console } = require("console");
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
  user: env.DB_USERNAME,
  password: env.DB_PASSWORD,
  host: env.DB_HOST,
  port: env.DB_PORT,
  database: env.DB_DATABASE,
  sslmode: "REQUIRED",
});

connection.connect((error) => {
  if (error) {
    console.log("error", error);
    return;
  } else {
    console.log("SUCCESS database");
  }
});

app.get("/api/library/", async (req, res) => {
  jwt.verify(
    req.cookies.authToken,
    user_secretkey,
    async function (err, decodedToken) {
      if (err) {
        console.log(err);
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
  const bookName = req.query.title;
  try {
    const [bookInfo] = await Promise.all([bookData(bookName)]);
    const authorInfo = await authorData(bookInfo[0].bookid);
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

app.post("/api/createaccount", function (req, res) {
  const data = req.body;

  connection.query(
    "SELECT * FROM users WHERE userEmail = ? OR userName = ?",
    [data.email, data.username],
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
      res.cookie("authToken", token, {
        httpOnly: true,
        secure: true,
        sameSite: "Strict",
      });
      res.json({ message: "user exist", userName: userName, token: token });
    } else {
      res.json({ message: "no user exist" });
    }
  });
});

app.post("/api/removecookie", function (req, res) {
  res.clearCookie("authToken", { httpOnly: true });
  res.json({ success: true });
});

app.get("/api/protected", function (req, res) {
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
});

app.get("/api/latest", function (req, res) {
  const query =
    " SELECT * FROM lightnovelonline.books ORDER BY STR_TO_DATE(release_date, '%Y/%m/%d') DESC LIMIT 0,22;";

  connection.query(query, function (err, results) {
    if (err) {
      res.json({ error: "error" });
    }
    res.json({ books: results });
  });
});

app.get("/api/novelsCreated", function (req, res) {
  jwt.verify(
    req.cookies.authToken,
    user_secretkey,
    async function (err, decodedToken) {
      if (err) {
        res.sendStatus(403);
      } else {
        const userID = decodedToken.user;
        const data = await usersNovels(userID);
        res.json({ data: data });
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
        const userId = decodedToken.user;

        const query =
          "INSERT INTO userlibrary (userid,bookid,currentpage) VALUES (?,?,0)";

        connection.query(
          query,
          [userId, req.body.id],
          function (error, result) {
            if (error) {
              console.log(error);
            } else {
              connection.query(
                "UPDATE books SET totalinlibrary = COALESCE(totalinlibrary, 0) + 1 WHERE bookid = ?",
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
          }
        );
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
        const userId = decodedToken.user;
        const bookId = req.body.id;

        const query =
          "DELETE FROM userlibrary WHERE bookid = ? AND userid = ? ";

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
      if (err) {
        res.sendStatus(403);
      } else {
        const userid = decodedToken.user;
        const bookid = req.body.id;

        const query =
          "SELECT * FROM userLibrary WHERE userid = ? AND bookid = ?";
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
    }
  );
});

app.post("/api/BooksBasedOnSearch", function (req, res) {
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
});

app.post("/api/createNewBook", function (req, res) {
  jwt.verify(
    req.cookies.authToken,
    user_secretkey,
    function (err, decodedToken) {
      if (err) {
        return res.sendStatus(403);
      }
      const userId = decodedToken.user;
      const data = req.body;

      const checkData = checkIfDataCorrect(data);
      if (checkData !== "OK") {
        return res.json({ errorData: checkData });
      }

      connection.query(
        "SELECT * FROM books WHERE author = ?",
        [userId],
        function (err, results) {
          if (err) {
            console.log(err);
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
                console.log(err);
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
    "For 18+",
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

  if (data.Synopsis.length > 300) {
    return "Synopsis exceeds maximum length of 300 characters";
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

  connection.query(query, [req.body[0], req.body[1]], function (err, results) {
    if (err) {
      console.log(err);
    } else {
      if (results === undefined) {
        res.json({ message: "error" });
      }
      if (results.length > 0) {
        const token = jwt.sign({ admin: results[0].adminid }, admin_sercretkey);
        res.json({ message: "success", token: token });
      } else {
        res.json({ message: "fail" });
      }
    }
  });
});

app.get("/api/admin/access", function (req, res) {
  jwt.verify(req.cookies.authToken, admin_sercretkey, function (err, decoded) {
    if (err) {
      res.json({ message: "error" });
    } else {
      res.json({ message: "success" });
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
        const userId = decodedToken.user;
        const bookTitle = req.body.bookName.replaceAll("-", " ");

        const query =
          "SELECT author, bookid,totalpages FROM lightnovelonline.books WHERE title = ?";
        connection.query(query, [bookTitle], function (err, results) {
          if (err) {
            console.log(err);
          } else {
            if (results[0].author === userId) {
              res.json({
                message: "valid",
                bookId: results[0].bookid,
                totalpages: results[0].totalpages,
              });
            } else {
              res.json({ message: "invalid" });
            }
          }
        });
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
      const bookId = req.query.id;

      bookDataID(bookId).then((results) => {
        res.json({ data: results });
      });
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

      const bookId = req.body.bookId;
      const chapterContent = req.body.chapterContent;
      const currentChapter = req.body.chapterNumber;
      const chapterTitle = req.body.chapterTitle;

      connection.query(
        "SELECT * FROM chapters WHERE bookid = ?",
        [bookId],
        function (err, results) {
          if (err) {
            console.log(err);
          } else {
            if (results.length > 5000) {
              res.json({ message: "To many chapters" });
            }
          }
        }
      );

      if (req.body.chapterContent.length > 50000) {
        res.json({ error: "To long chapter" });
        return;
      } else if (req.body.chapterContent.length < 2500) {
        res.json({ error: "To short chapter" });
        return;
      }
      if (req.body.chapterTitle.length > 25) {
        res.json({ error: "To long title" });
        return;
      } else if (req.body.chapterTitle.length < 1) {
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
            console.log(err);
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
    }
  );
});

function addChapterNumber(bookId, chapterNumber) {
  const query = "UPDATE books SET totalpages = ? WHERE bookid = ?";

  connection.query(query, [chapterNumber, bookId], function (err, results) {
    if (err) {
      return "Error";
    } else {
      return "Success";
    }
  });
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

      const bookName = req.body.bookName;
      const chapterNumber = req.body.chapterNumber;

      connection.query(
        "SELECT bookid,totalpages FROM books WHERE title = ?",
        [bookName],
        function (err, results) {
          if (err) {
            res.json({ error: "error" });
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
    }
  );
});

app.post("/api/setLatestReadChapter", function (req, res) {
  jwt.verify(
    req.cookies.authToken,
    user_secretkey,
    async function (err, decodedToken) {
      if (err) {
      }

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
    }
  );
});

module.exports = app;
