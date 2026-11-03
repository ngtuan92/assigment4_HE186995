const mongoose = require("mongoose");
const Schema = mongoose.Schema;

// Define schema
const subjectSchema = new Schema(
  {
    code: { type: String, required: true },
    name: { type: String, required: true },
    credits: { type: Number, required: true },
    status: { type: String, required: true },
  },
  { timestamps: true },
);

const Subject = mongoose.model("Subject", subjectSchema);

module.exports = Subject;
