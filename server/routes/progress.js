// routes/progress.js
import express from 'express';
import Progress from '../models/Progress.js';

const router = express.Router();

// Helper function to merge overlapping intervals
function mergeIntervals(intervals) {
  const valid = intervals.filter(
    (i) => i && typeof i.start === 'number' && typeof i.end === 'number'
  );

  if (valid.length === 0) return [];

  const sorted = valid.sort((a, b) => a.start - b.start);
  const merged = [sorted[0]];

  for (let i = 1; i < sorted.length; i++) {
    const last = merged[merged.length - 1];
    const current = sorted[i];

    if (current.start <= last.end) {
      last.end = Math.max(last.end, current.end);
    } else {
      merged.push(current);
    }
  }

  return merged;
}

// GET progress for a user and video
router.get('/:userId/:videoId', async (req, res) => {
  const { userId, videoId } = req.params;
  try {
    const progress = await Progress.findOne({ userId, videoId });
    res.json(progress || {});
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch progress' });
  }
});

// POST/UPDATE progress
router.post('/update', async (req, res) => {
  const { userId, videoId, newInterval, lastPosition } = req.body;

  // Validate required fields
  if (!userId || !videoId || typeof lastPosition !== 'number') {
    return res.status(400).json({ error: 'Missing required fields' });
  }

  try {
    let progress = await Progress.findOne({ userId, videoId });

    const isValidInterval =
      newInterval &&
      typeof newInterval.start === 'number' &&
      typeof newInterval.end === 'number';

    if (!progress) {
      progress = new Progress({
        userId,
        videoId,
        intervals: isValidInterval ? [newInterval] : [],
        lastPosition,
      });
    } else {
      if (isValidInterval) {
        const allIntervals = [...progress.intervals, newInterval];
        progress.intervals = mergeIntervals(allIntervals);
      }
      progress.lastPosition = lastPosition;
    }

    await progress.save();

    const totalWatched = progress.intervals.reduce(
      (sum, int) => sum + (int.end - int.start),
      0
    );

    res.json({ success: true, totalWatched });
  } catch (err) {
    console.error('Error updating progress:', err);
    res.status(500).json({ error: 'Failed to update progress' });
  }
});

export default router;
