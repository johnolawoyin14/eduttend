// Assuming you have a Lecturer model and you're using a middleware like body-parser
const express = require("express");
const bodyParser = require("body-parser");
const app = express();

// Middleware
app.use(bodyParser.urlencoded({ extended: true }));

// Assuming you have a Lecturer model
const Lecturer = require("./models/lecturer");

app.post("/login", async (req, res) => {
  const { username, password } = req.body;

  try {
    // Authenticate the lecturer (you might use a library like passport.js for this)
    const lecturer = await Lecturer.findOne({ username, password });

    if (lecturer) {
      // Set the lecturer ID in the session (you might use a session middleware)
      req.session.lecturerId = lecturer._id;

      // Redirect to the lecturer's section
      res.redirect(`/lecturer/${lecturer._id}`);
    } else {
      // Handle invalid credentials
      res.status(401).send("Invalid credentials");
    }
  } catch (error) {
    console.error(error);
    res.status(500).send("Internal Server Error");
  }
});

// ... Other routes and configurations
const express = require('express');
const app = express();

// ... Other middleware and configurations

// Example route in Express
const express = require('express');
const router = express.Router();

// Assuming you have a Lecturer and Student model
const Lecturer = require('../models/lecturer');
const Student = require('../models/student');

router.get('/lecturer/:lecturerId', async (req, res) => {
  try {
    const lecturerId = req.params.lecturerId;

    // Retrieve the list of courses offered by the lecturer
    const lecturer = await Lecturer.findById(lecturerId);
    const lecturerCourses = lecturer.courses;

    // Query the database to find students enrolled in those courses
    const students = await Student.find({ courses: { $in: lecturerCourses } });

    // Render the results in your view
    res.render('lecturerSection', { lecturerCourses, students });
  } catch (error) {
    console.error(error);
    res.status(500).send('Internal Server Error');
  }
});

module.exports = router;










// authentication

// app.js

const express = require('express');
const session = require('express-session');
const app = express();

app.use(express.urlencoded({ extended: true }));

// Use express-session for session management
app.use(session({
  secret: 'your-secret-key', // Change this to a secure secret
  resave: false,
  saveUninitialized: true,
  cookie: { secure: false }, // Set to true in a production environment with HTTPS
}));

// Middleware to check if the user is authenticated
const isAuthenticated = (req, res, next) => {
  if (req.session.isAuthenticated) {
    return next();
  } else {
    res.redirect('/login');
  }
};

// Login route
app.get('/login', (req, res) => {
  res.sendFile(__dirname + '/views/login.html');
});

// Authenticate user
app.post('/login', (req, res) => {
  // Check credentials (replace with your authentication logic)
  if (req.body.username === 'admin' && req.body.password === 'password') {
    req.session.isAuthenticated = true;
    res.redirect('/staff/123'); // Redirect to a protected route
  } else {
    res.send('Invalid credentials');
  }
});

// Logout route
app.get('/logout', (req, res) => {
  req.session.destroy(() => {
    res.redirect('/');
  });
});

// Protected route
app.get('/staff/:id', isAuthenticated, (req, res) => {
  res.send(`Welcome to the staff route, user ${req.params.id}`);
});

// Home route
app.get('/', (req, res) => {
  res.send('Home page');
});

const PORT = 3000;
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
