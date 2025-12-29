const express = require('express');
const router = express.Router();
const fs = require('fs').promises;
const path = require('path');
const XLSX = require('xlsx');
const { Parser } = require('json2csv');

const mentorsFile = path.join(__dirname, '../mentors.json');
const mentorsExcelFile = path.join(__dirname, '../mentors.xlsx');

let mentors = [];

async function loadMentors() {
  try {
    const data = await fs.readFile(mentorsFile, 'utf8');
    mentors = JSON.parse(data);
  } catch (err) {
    mentors = [];
  }
}

async function saveMentors() {
  await fs.writeFile(mentorsFile, JSON.stringify(mentors, null, 2));
  // Also save to Excel
  const ws = XLSX.utils.json_to_sheet(mentors);
  const wb = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(wb, ws, 'Mentors');
  XLSX.writeFile(wb, mentorsExcelFile);
}

loadMentors();

// GET /api/mentors
router.get('/', (req, res) => {
  res.json(mentors);
});

// POST /api/mentors
router.post('/', async (req, res) => {
  const { name, mentorId, subjects, classTimings } = req.body;
  const newMentor = { id: Date.now().toString(), name, mentorId, subjects, classTimings };
  mentors.push(newMentor);
  await saveMentors();
  res.json(newMentor);
});

// PUT /api/mentors/:id
router.put('/:id', async (req, res) => {
  const { name, mentorId, subjects, classTimings } = req.body;
  const mentor = mentors.find(m => m.id === req.params.id);
  if (mentor) {
    mentor.name = name;
    mentor.mentorId = mentorId;
    mentor.subjects = subjects;
    mentor.classTimings = classTimings;
    await saveMentors();
    res.json(mentor);
  } else {
    res.status(404).json({ error: 'Mentor not found' });
  }
});

// DELETE /api/mentors/:id
router.delete('/:id', async (req, res) => {
  const index = mentors.findIndex(m => m.id === req.params.id);
  if (index !== -1) {
    mentors.splice(index, 1);
    await saveMentors();
    res.json({ message: 'Mentor deleted' });
  } else {
    res.status(404).json({ error: 'Mentor not found' });
  }
});

// Export to CSV
router.get('/export', (req, res) => {
  const fields = ['name', 'mentorId', 'subjects', 'classTimings'];
  const opts = { fields };
  const parser = new Parser(opts);
  const csv = parser.parse(mentors);
  res.header('Content-Type', 'text/csv');
  res.attachment('mentors.csv');
  res.send(csv);
});

module.exports = router;