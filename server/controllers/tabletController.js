const Tablet = require('../models/Tablet');
const Log = require('../models/Log');
const User = require('../models/User');
const { sendProofAlert, sendHistoryReport } = require('../utils/email');

exports.addTablet = async (req, res) => {
  try {
    const { tabletName, scheduleTime, frequency } = req.body;
    const newTablet = new Tablet({
      userId: req.userId,
      tabletName,
      scheduleTime,
      frequency: frequency || 'daily'
    });
    await newTablet.save();
    res.status(201).json(newTablet);
  } catch (err) {
    res.status(500).json({ message: "Error adding tablet", error: err.message });
  }
};

exports.getTablets = async (req, res) => {
  try {
    const tablets = await Tablet.find({ userId: req.userId });
    res.json(tablets);
  } catch (err) {
    res.status(500).json({ message: "Error fetching tablets", error: err.message });
  }
};

exports.deleteTablet = async (req, res) => {
  try {
    await Tablet.findOneAndDelete({ _id: req.params.id, userId: req.userId });
    res.json({ message: "Tablet deleted successfully" });
  } catch (err) {
    res.status(500).json({ message: "Error deleting tablet", error: err.message });
  }
};

exports.uploadProof = async (req, res) => {
  try {
    const { tabletId, tabletName } = req.body;
    if (!req.file) return res.status(400).json({ message: "No image provided" });

    const user = await User.findById(req.userId);
    if (!user) return res.status(404).json({ message: "User not found" });

    const todayStr = new Date().toISOString().split('T')[0];

    const newLog = new Log({
      userId: req.userId,
      tabletId,
      tabletName,
      imageUrl: req.file.path,
      date: todayStr,
      status: 'taken'
    });

    await newLog.save();

    // Send Alert to Parent
    await sendProofAlert(user.parentEmail, user.name, tabletName, req.file.path);

    res.status(201).json(newLog);
  } catch (err) {
    res.status(500).json({ message: "Error uploading proof", error: err.message });
  }
};

exports.getTodayLogs = async (req, res) => {
  try {
    const todayStr = new Date().toISOString().split('T')[0];
    const logs = await Log.find({ userId: req.userId, date: todayStr });
    res.json(logs);
  } catch (err) {
    res.status(500).json({ message: "Error fetching today's logs", error: err.message });
  }
};

exports.getAllLogs = async (req, res) => {
  try {
    const logs = await Log.find({ userId: req.userId });
    res.json(logs);
  } catch (err) {
    res.status(500).json({ message: "Error fetching history", error: err.message });
  }
};

exports.reportAndClearHistory = async (req, res) => {
  try {
    const user = await User.findById(req.userId);
    if (!user) return res.status(404).json({ message: "User not found" });

    const logs = await Log.find({ userId: req.userId });
    if (logs.length === 0) {
      return res.status(400).json({ message: "No history to report" });
    }

    // Send report to parent
    await sendHistoryReport(user.parentEmail, user.name, logs);

    // Clear logs
    await Log.deleteMany({ userId: req.userId });

    res.json({ message: "History reported and cleared successfully" });
  } catch (err) {
    res.status(500).json({ message: "Error reporting and clearing history", error: err.message });
  }
};
