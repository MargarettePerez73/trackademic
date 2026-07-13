// Offline dummy data – used when server is unavailable
export const DUMMY_CLASSES = [
  {
    id: 1, code: 'ag08itoc',
    subject_name: 'WEB SYSTEMS AND TECHNOLOGIES',
    course_code: 'BSIT BA-3103',
    instructor: 'Jason C. Magsino',
    school_year: '2025-2026', semester: 'First Semester',
    status: 'Archived', banner_color: '#5d6d7e',
    schedules: ['Tuesday: 02:00 PM - 04:00 PM', 'Friday: 04:00 PM - 07:00 PM'],
  },
  {
    id: 2, code: 'ag09adet',
    subject_name: 'APPLICATION DEVELOPMENT AND EMERGING TECHNOLOGIES',
    course_code: 'BSIT BA-3303',
    instructor: 'Jason C. Magsino',
    school_year: '2025-2026', semester: 'Midterm',
    status: 'Active', banner_color: '#2e86c1',
    schedules: ['Monday: 01:00 PM - 06:00 PM', 'Wednesday: 01:00 PM - 06:00 PM', 'Saturday: 07:00 AM - 12:00 PM'],
  },
];

export const DUMMY_PERFORMANCE = [
  { class_code: 'ag08itoc', title: 'HTML Activity 1',              total_items: 100, score: 90,  average: '90.00%', semester: 'First Semester', school_year: '2025-2026' },
  { class_code: 'ag08itoc', title: 'HTML Activity 2 & Assignment 1',total_items:100, score: 100, average: '100.00%',semester: 'First Semester', school_year: '2025-2026' },
  { class_code: 'ag08itoc', title: 'HTML and CSS Quiz 1',          total_items: 20,  score: 14,  average: '70.00%', semester: 'First Semester', school_year: '2025-2026' },
  { class_code: 'ag08itoc', title: 'CSS Activity',                 total_items: 100, score: 92,  average: '92.00%', semester: 'First Semester', school_year: '2025-2026' },
  { class_code: 'ag08itoc', title: 'Bootstrap Activity',           total_items: 100, score: 74,  average: '74.00%', semester: 'First Semester', school_year: '2025-2026' },
  { class_code: 'ag08itoc', title: 'Midterm Examination Results',  total_items: 60,  score: 40,  average: '66.67%', semester: 'First Semester', school_year: '2025-2026' },
  { class_code: 'ag08itoc', title: 'Midterm Lab Exam Result',      total_items: 100, score: 100, average: '100.00%',semester: 'First Semester', school_year: '2025-2026' },
  { class_code: 'ag08itoc', title: 'PHP MySQL, Session, CRUD',     total_items: 100, score: 85,  average: '85.00%', semester: 'First Semester', school_year: '2025-2026' },
  { class_code: 'ag08itoc', title: 'Chapter Test',                 total_items: 30,  score: 18,  average: '60.00%', semester: 'First Semester', school_year: '2025-2026' },
];
