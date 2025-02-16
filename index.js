import dotenv from "dotenv";
import express from "express";
import mongoose from "mongoose";
import { fileURLToPath } from 'url';
import { dirname } from 'path';
import cors from 'cors';
import favicon from 'serve-favicon';
import path from 'path';
// Define a common schema for all collections
const commonSchema = new mongoose.Schema({
  Question: { type: String, required: true },
  answer: { type: String, required: true },
  lvl: { type: String, required: true },
  answerimg: { type: String },
  image: { type: String }
});

// const Question = mongoose.model('Question', questionSchema);


dotenv.config();

// Get the current directory name
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const app = express();
const port = 10000;
const dbURI = "mongodb+srv://sara:Sara1234@cluster0.hqsjf3p.mongodb.net/SaraGame?retryWrites=true&w=majority&appName=Cluster0";
app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(express.static(__dirname, {
  extensions: ["html", "htm", "gif", "png"]
}));
app.use(express.static('public'));
app.use('img', express.static(__dirname + "/img"));
// Serve the favicon specifically

// Set views
app.set('views', './Views');
app.set('view engine', 'ejs');

// Routes
app.get('/', (req, res) => {
  res.render("Home");
});
app.get('/ourgames', (req, res) => {
  res.render("ourgames");
});
app.get('/Startgame', (req, res) => {
  res.render("Startgame");
});
app.get('/start2', (req, res) => {
  res.render("start2");
});
app.get('/start3', (req, res) => {
  res.render("start3");
});
app.get('/start4', (req, res) => {
  res.render("start4");
});
app.get('/start5', (req, res) => {
  res.render("start5");
});

app.use(cors());
app.get('/api/questions', async (req, res) => {
  const { category, level } = req.query;

  try {
    // Log the incoming parameters to ensure they are being received correctly
    //console.log(`Fetching questions from category: ${category}, level: ${level}`);

    // Dynamically set the collection name based on the category
    const collectionName = category;
    //console.log("Using collection:", collectionName);

    // Create the dynamic model for the collection using the common schema
    const Question = mongoose.model(collectionName, commonSchema, collectionName);

    // Build the query to find the correct level
    const query = { lvl: level };  // Ensure that 'level' is exactly the value you're passing

    // Log the query being executed
    //console.log("Executing query:", query);

    // Query the database for questions matching the category and level
    const questions = await Question.find(query);

    // Log the fetched questions to debug
    //console.log("Fetched questions:", questions);

    // Check if any questions were found
    if (questions.length > 0) {
      res.json(questions);  // Send the found questions as a response
    } else {
      res.status(404).json({ message: "No questions found for this category and level" });
    }
  } catch (err) {
    // Log any error that occurs during fetching
    console.error("Error fetching questions:", err);
    res.status(500).json({ message: "Internal Server Error" });
  }
});



// Connect to MongoDB and start server
mongoose.connect(dbURI)
  .then(() => {
    console.log("Connected to MongoDB");
    app.listen(port, () => {
      console.log(`Server running at http://localhost:${port}`);
    });
  })
  .catch(err => {
    console.log("Error connecting to MongoDB:", err);
  });
