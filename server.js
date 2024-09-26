//initialise dependencies

const express = require("express");
const app = express();
const mysql = require("mysql2");
const dotenv = require("dotenv");
const cors = require("cors");

app.use(express.json());
app.use(cors());
dotenv.config();

// CONNECT TO THE DATABASE***
const db = mysql.createConnection({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
});

//CHECK IF DB CONNECTION WORKS
db.connect((err) => {
  //No wedding today
  if (err) return console.log("Error connecting to the Mysql db");

  //Yes wedding connected
  console.log("Connected to Mysql successfully as id: ", db.threadId);

  //Your code goes here
  //GET METHOD example

  // Set the view engine to EJS for rendering dynamic content
  app.set("view engine", "ejs");
  app.set("views", __dirname + "/views");

  // Define route for home page
  app.get("/", (req, res) => {
    // Send a message to the browser indicating the server started successfully
    res.send("server started successfully! wedding can go on!!!");
  });

  // Define route for retrieving data from the database
  // 'data' is the name of the file (EJS template)
  //QUESTION 1
  app.get("/data", (req, res) => {
    console.log("Data route accessed!");
    db.query("SELECT * FROM patients", (err, results) => {
      if (err) {
        console.error("Error retrieving from the database: ", err);
        res.status(500).send("Error retrieving data");
      } else {
        // Display the records to the browser using EJS
        console.log("Data retrieved successfully: ", results); // Debugging purposes
        res.render("data", { results: results });
      }
    });
  });

  //QUESTION 2
  // Define the /providers endpoint
  app.get("/providers", (req, res) => {
    db.query(
      "SELECT first_name, last_name, provider_specialty FROM providers",
      (err, results) => {
        if (err) {
          console.error("Error retrieving providers: ", err);
          return res.status(500).send("Error retrieving providers");
        }
        res.json(results);
      }
    );
  });

  //QUESTION 3
  // Define the /patients/:firstName endpoint
  app.get("/patients/:firstName", (req, res) => {
    const firstName = req.params.firstName;
    db.query(
      "SELECT * FROM patients WHERE first_name = ?",
      [firstName],
      (err, results) => {
        if (err) {
          console.error("Error retrieving patients by first name: ", err);
          return res
            .status(500)
            .send("Error retrieving patients by first name");
        }
        res.json(results);
      }
    );
  });

  //QUESTION 4
  // Define the /providers/specialty/:specialty endpoint
  app.get("/providers/specialty/:specialty", (req, res) => {
    const specialty = req.params.specialty;
    db.query(
      "SELECT * FROM providers WHERE provider_specialty = ?",
      [specialty],
      (err, results) => {
        if (err) {
          console.error("Error retrieving providers by specialty: ", err);
          return res
            .status(500)
            .send("Error retrieving providers by specialty");
        }
        res.json(results);
      }
    );
  });

  // Start the server and listen on the port from the .env file
  app.listen(3301, () => {
    console.log("Server listening on port 3301");

    // Send a message to the browser
    app.get("/", (req, res) => {
      res.send("Server started successfully! Wedding can go on!!!");
    });
  });
});
