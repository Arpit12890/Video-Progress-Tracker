// models/Progress.js
import mongoose from 'mongoose';

const IntervalSchema = new mongoose.Schema({
  start: Number,
  end: Number,
}, { _id: false });

const ProgressSchema = new mongoose.Schema({
  userId: String,
  videoId: String,
  intervals: [IntervalSchema],
  lastPosition: Number,
});

const Progress = mongoose.model('Progress', ProgressSchema);
export default Progress;
