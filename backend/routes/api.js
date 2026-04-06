const express = require('express');
const router = express.Router();
const Task = require('../models/Task');
const auth = require('../middleware/auth');
const mongoose = require('mongoose');

// Get tasks (filtered by date or defaults to Today)
router.get('/tasks', auth, async (req, res) => {
  try {
    let dateStr = req.query.date;
    // targetDate is either the provided date or Today
    const targetDate = dateStr ? new Date(dateStr) : new Date();
    
    // Calculate strict bounds for the entirety of that specific day
    const startDate = new Date(targetDate.getFullYear(), targetDate.getMonth(), targetDate.getDate());
    const endDate = new Date(startDate);
    endDate.setDate(endDate.getDate() + 1);

    let query = { userId: req.user.id };
    
    if (req.query.all === 'true') {
      // Fetch everything from today onwards
      query.date = { $gte: startDate };
    } else {
      query.date = { $gte: startDate, $lt: endDate };
    }

    // Sort by date ascending to show closest upcoming tasks first
    const tasks = await Task.find(query).sort({ date: 1 });
    
    res.json(tasks);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Create task
router.post('/tasks', auth, async (req, res) => {
  try {
    const newTask = new Task({
      ...req.body,
      userId: req.user.id
    });
    const savedTask = await newTask.save();
    res.status(201).json(savedTask);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Update task
router.put('/tasks/:id', auth, async (req, res) => {
  try {
    const updatedTask = await Task.findOneAndUpdate(
      { _id: req.params.id, userId: req.user.id },
      req.body,
      { new: true }
    );
    if (!updatedTask) return res.status(404).json({ error: "Task not found" });
    res.json(updatedTask);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Delete task
router.delete('/tasks/:id', auth, async (req, res) => {
  try {
    const deletedTask = await Task.findOneAndDelete({ _id: req.params.id, userId: req.user.id });
    if (!deletedTask) return res.status(404).json({ error: "Task not found" });
    res.json({ message: "Task deleted successfully" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Analytics Dashboard Endpoint
router.get('/analytics', auth, async (req, res) => {
  try {
    const tasks = await Task.find({ userId: req.user.id }).lean();
    
    // Category aggregation
    const categoriesMap = {};
    tasks.forEach(t => {
      const cat = t.categoryId || 'Other';
      if(!categoriesMap[cat]) categoriesMap[cat] = { total: 0, completed: 0 };
      categoriesMap[cat].total += 1;
      if (t.status === 'completed') categoriesMap[cat].completed += 1;
    });
    const categoryData = Object.keys(categoriesMap).map(cat => ({
      name: cat,
      total: categoriesMap[cat].total,
      completed: categoriesMap[cat].completed
    }));

    // Generate Weekly and Monthly maps
    // For simplicity, grouping by formatted date "MM-DD"
    const now = new Date();
    
    const groupByDays = (days) => {
      const map = {};
      for(let i=days-1; i>=0; i--) {
        const d = new Date(now);
        d.setDate(d.getDate() - i);
        const dStr = d.toISOString().substring(5, 10);
        map[dStr] = { date: dStr, completed: 0, total: 0 };
      }
      
      tasks.forEach(t => {
        const dateVal = t.date || t.createdAt || new Date();
        const dStr = new Date(dateVal).toISOString().substring(5, 10);
        if(map[dStr]) {
          map[dStr].total += 1;
          if (t.status === 'completed') map[dStr].completed += 1;
        }
      });
      return Object.values(map).map(day => ({
        ...day,
        completionRate: day.total > 0 ? Math.round((day.completed / day.total) * 100) : 0
      }));
    };

    const weeklyData = groupByDays(7);
    const monthlyData = groupByDays(30);

    // Calculate Streak
    // A day is a streak if total > 0 and (completed/total) >= 0.8
    let streak = 0;
    // Iterate backwards from today to the past
    // Using 90 days to avoid infinite/huge loop
    const pastDays = groupByDays(90).reverse();
    for (let day of pastDays) {
      if (day.total > 0 && (day.completed / day.total) >= 0.8) {
        streak++;
      } else if (day.total > 0 && (day.completed / day.total) < 0.8) {
        break; // streak lost
      }
    }

    res.json({
        categoryData,
        weeklyData,
        monthlyData,
        streak
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Reports Engine - Advanced Analytics and Historical Fetching
router.get('/reports', auth, async (req, res) => {
  try {
    const pipeline = [
      { $match: { userId: new mongoose.Types.ObjectId(req.user.id) } },
      {
        $group: {
          _id: { $dateToString: { format: "%Y-%m-%d", date: { $ifNull: ["$date", "$createdAt"] } } },
          totalTasks: { $sum: 1 },
          completed: { $sum: { $cond: [ { $eq: ["$status", "completed"] }, 1, 0 ] } },
          pending: { $sum: { $cond: [ { $ne: ["$status", "completed"] }, 1, 0 ] } },
          tasksDetail: { $push: { category: "$categoryId", status: "$status", time: "$timeSection" } }
        }
      },
      { $sort: { "_id": -1 } } // Fetch chronologically latest dates first natively
    ];

    const groupedData = await Task.aggregate(pipeline);
    
    let totalCompletedAllTime = 0;
    let totalTasksAllTime = 0;
    let bestDay = null; 
    let worstDay = null;

    let timeSlotCounts = {};
    let categorySkipCounts = {}; 
    let currentStreak = 0; 
    let streakActive = true; 

    const reports = groupedData.map(day => {
      const percentage = day.totalTasks > 0 ? Math.round((day.completed / day.totalTasks) * 100) : 0;
      
      totalCompletedAllTime += day.completed;
      totalTasksAllTime += day.totalTasks;

      if (!bestDay || percentage > bestDay.percentage) { bestDay = { date: day._id, percentage }; }
      if (!worstDay || percentage < worstDay.percentage) { worstDay = { date: day._id, percentage }; }

      const catsMap = {}; // breakdown specifically for THIS day
      day.tasksDetail.forEach(t => {
        const cat = t.category || 'Other';
        const isSkipped = t.status !== 'completed';

        catsMap[cat] = (catsMap[cat] || 0) + 1; // Map structure per user request

        // Append to global insights maps
        if(t.time) timeSlotCounts[t.time] = (timeSlotCounts[t.time] || 0) + 1;
        if(isSkipped) categorySkipCounts[cat] = (categorySkipCounts[cat] || 0) + 1;
      });

      // Calculate streak tracking back from "Today" towards History
      if (streakActive) {
        if (percentage >= 80) currentStreak++;
        else streakActive = false;
      }

      return {
        date: day._id,
        totalTasks: day.totalTasks,
        completed: day.completed,
        pending: day.pending,
        percentage,
        categories: catsMap
      };
    });

    const averageCompletion = totalTasksAllTime > 0 ? Math.round((totalCompletedAllTime / totalTasksAllTime) * 100) : 0;
    
    // Extrapolate highest ranked elements
    const mostSkippedCategory = Object.keys(categorySkipCounts).sort((a,b) => categorySkipCounts[b] - categorySkipCounts[a])[0] || 'None';
    const mostActiveTimeSlot = Object.keys(timeSlotCounts).sort((a,b) => timeSlotCounts[b] - timeSlotCounts[a])[0] || 'None';

    res.json({
        reports,
        insights: {
           averageCompletion,
           bestDay,
           worstDay,
           mostSkippedCategory,
           mostActiveTimeSlot,
           currentStreak
        }
    });

  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
