require("dotenv").config();
const express = require("express");
const cors = require("cors");
const app = express();
const connectDB = require("./config/db");
const authRouter = require('./routes/auth.routes');
const classesRouter = require('./routes/classes.routes');
const studentsRouter = require('./routes/students.routes');
const { verifyToken } = require('./middleware/auth.middleware');

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get("/", async (req, res) => {
  try {
    res.send({ message: "Welcome to Practical  Exam!" });
  } catch (error) {
    res.send({ error: error.message });
  }
});

app.use('/api/auth', authRouter);

// Every route mounted below this line requires a valid Bearer token
app.use(verifyToken);

app.use('/api/classes', classesRouter);
app.use('/api/students', studentsRouter);


connectDB();
const PORT = process.env.PORT || 9999;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));

module.exports = app;
