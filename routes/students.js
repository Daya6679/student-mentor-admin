const express = require('express');

const router = express.Router();

const fs = require('fs').promises;

const path = require('path');

const studentsFile = path.join(__dirname, '../students.json');

let students = [];

async function loadStudents() {
  try {
    const data = await fs.readFile(studentsFile, 'utf8');
    students = JSON.parse(data);
  } catch (err) {
    students = [];
  }
}

async function saveStudents() {
  await fs.writeFile(studentsFile, JSON.stringify(students, null, 2));
}

loadStudents();

// GET /api/students

router.get('/', (req, res) => {

  res.json(students);

});

// POST /api/students

router.post('/', async (req, res) => {

  const { name, class: studentClass, phone, mentorName } = req.body;

  const newStudent = { id: Date.now().toString(), name, class: studentClass, phone, mentorName };

  students.push(newStudent);

  await saveStudents();

  res.json(newStudent);

});

// PUT /api/students/:id

router.put('/:id', async (req, res) => {

  const { name, class: studentClass, phone, mentorName } = req.body;

  const student = students.find(s => s.id === req.params.id);

  if (student) {

    student.name = name;

    student.class = studentClass;

    student.phone = phone;

    student.mentorName = mentorName;

    await saveStudents();

    res.json(student);

  } else {

    res.status(404).json({ error: 'Student not found' });

  }

});

// DELETE /api/students/:id

router.delete('/:id', async (req, res) => {

  const index = students.findIndex(s => s.id === req.params.id);

  if (index !== -1) {

    students.splice(index, 1);

    await saveStudents();

    res.json({ message: 'Student deleted' });

  } else {

    res.status(404).json({ error: 'Student not found' });

  }

});

// Export to CSV

const { Parser } = require('json2csv');

router.get('/export', (req, res) => {

  const fields = ['name', 'class', 'phone', 'mentorName'];

  const opts = { fields };

  const parser = new Parser(opts);

  const csv = parser.parse(students);

  res.header('Content-Type', 'text/csv');

  res.attachment('students.csv');

  res.send(csv);

});

module.exports = router;