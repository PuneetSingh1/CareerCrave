const express = require('express');
const mongoose = require('mongoose');

// Initialize Express app
const app = express();
app.use(express.json());

// Connect to MongoDB
mongoose.connect('mongodb://localhost/questionnaire', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});
const db = mongoose.connection;
db.once('open', () => {
  console.log('Connected to MongoDB');
});

// Define database schemas
const userSchema = new mongoose.Schema({
  name: String,
  email: String,
  password: String,
  phone_number: String,
});

const questionSchema = new mongoose.Schema({
  question: String,
  options: [String],
  correctAnswer: [String],
});

const testSchema = new mongoose.Schema({
  name: String,
  questions: [questionSchema],
});

const responseSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
  },
  test: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Test',
  },
  answers: [
    {
      question: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Question',
      },
      selectedAnswer: [String],
    },
  ],
  score: Number,
});

const User = mongoose.model('User', userSchema);
const Question = mongoose.model('Question', questionSchema);
const Test = mongoose.model('Test', testSchema);
const Response = mongoose.model('Response', responseSchema);

// Endpoint to submit a test
app.post('/submit-test', async (req, res) => {
  try {
    const { userId, testId, answers } = req.body;

    // Check if the user has already taken the test
    const existingResponse = await Response.findOne({ user: userId, test: testId });
    if (existingResponse) {
      return res.status(400).json({ error: 'User has already taken the test.' });
    }

    // Get the test details
    const test = await Test.findById(testId);
    if (!test) {
      return res.status(404).json({ error: 'Test not found.' });
    }

    let score = 0;

    // Calculate the score based on correct answers
    for (const answer of answers) {
      const question = await Question.findById(answer.question);
      if (!question) {
        return res.status(404).json({ error: 'Question not found.' });
      }

      const correctAnswer = question.correctAnswer.sort().toString();
      const selectedAnswer = answer.selectedAnswer.sort().toString();

      if (correctAnswer === selectedAnswer) {
        score++;
      }
    }

    // Store the response in the database
    const response = new Response({
      user: userId,
      test: testId,
      answers,
      score,
    });
    await response.save();

    // Return the response with the score
    res.json({ userId, testId, score });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Start the server
const port = 3000;
app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
