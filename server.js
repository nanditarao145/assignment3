/*********************************************************************************
*  WEB700 – Assignment 03
*  I declare that this assignment is my own work in accordance with Seneca  Academic Policy. 
*  No part of this assignment has been copied manually or electronically from any other source 
*  (including 3rd party web sites) or distributed to other students.
* 
*  Name: Nandita Rao
*  Student ID: 129570222
*  Date: 18th June, 2023
*   
********************************************************************************/ 


const express = require("express");
const path = require("path");
const collegeData = require("./modules/collegeData"); // Assuming you have a collegeData.js file in the same directory

const app = express();
const HTTP_PORT = process.env.PORT || 8080;

// Initialize the data collection
collegeData.initialize()
  .then(() => {
    // Start the server
    app.listen(HTTP_PORT, () => {
      console.log("Server listening on port: " + HTTP_PORT);
    });
  })
  .catch((err) => {
    console.error("Error initializing data:", err);
  });

// Routes
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "views", "home.html"));
});

app.get("/about", (req, res) => {
  res.sendFile(path.join(__dirname, "views", "about.html"));
});

app.get("/htmlDemo", (req, res) => {
  res.sendFile(path.join(__dirname, "views", "htmlDemo.html"));
});

app.get("/students", (req, res) => {
  const course = req.query.course;
  if (course) {
    collegeData.getStudentsByCourse(course)
      .then((students) => {
        if (students.length === 0) {
          res.json({ message: "no results" });
        } else {
          res.json(students);
        }
      })
      .catch((err) => {
        console.error("Error retrieving students by course:", err);
        res.sendStatus(500);
      });
  } else {
    collegeData.getAllStudents()
      .then((students) => {
        if (students.length === 0) {
          res.json({ message: "no results" });
        } else {
          res.json(students);
        }
      })
      .catch((err) => {
        console.error("Error retrieving all students:", err);
        res.sendStatus(500);
      });
  }
});

app.get("/tas", (req, res) => {
  collegeData.getTAs()
    .then((tas) => {
      if (tas.length === 0) {
        res.json({ message: "no results" });
      } else {
        res.json(tas);
      }
    })
    .catch((err) => {
      console.error("Error retrieving TAs:", err);
      res.sendStatus(500);
    });
});

app.get("/courses", (req, res) => {
  collegeData.getCourses()
    .then((courses) => {
      if (courses.length === 0) {
        res.json({ message: "no results" });
      } else {
        res.json(courses);
      }
    })
    .catch((err) => {
      console.error("Error retrieving courses:", err);
      res.sendStatus(500);
    });
});

app.get("/student/:num", (req, res) => {
  const num = req.params.num;
  collegeData.getStudentByNum(num)
    .then((student) => {
      if (student) {
        res.json(student);
      } else {
        res.json({ message: "no results" });
      }
    })
    .catch((err) => {
      console.error("Error retrieving student by number:", err);
      res.sendStatus(500);
    });
});

app.use((req, res) => {
  res.status(404).send("Page Not Found");
});

