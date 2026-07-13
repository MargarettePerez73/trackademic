-- Trackademic Clone – MySQL Schema
-- Run this in your MySQL database (sample_db)

CREATE DATABASE IF NOT EXISTS sample_db;
USE sample_db;

-- ─── Users table ────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS users (
  id            INT AUTO_INCREMENT PRIMARY KEY,
  sr_code       VARCHAR(20)  NOT NULL UNIQUE,
  name          VARCHAR(120) NOT NULL,
  full_name     VARCHAR(120) NOT NULL,
  username      VARCHAR(60)  NOT NULL UNIQUE,
  email         VARCHAR(120) NOT NULL UNIQUE,
  `password(md5)` VARCHAR(32) NOT NULL,
  section       VARCHAR(60)  DEFAULT NULL,
  year_level    TINYINT      DEFAULT 1,
  course        VARCHAR(60)  DEFAULT NULL,
  created_at    DATETIME     NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- ─── Classes table ───────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS classes (
  id           INT AUTO_INCREMENT PRIMARY KEY,
  code         VARCHAR(30)  NOT NULL UNIQUE,
  subject_name VARCHAR(200) NOT NULL,
  course_code  VARCHAR(60)  NOT NULL,
  instructor   VARCHAR(120) NOT NULL,
  school_year  VARCHAR(20)  NOT NULL,
  semester     VARCHAR(40)  NOT NULL,
  status       ENUM('Active','Archived') NOT NULL DEFAULT 'Active',
  banner_color VARCHAR(20)  NOT NULL DEFAULT '#2e86c1',
  created_at   DATETIME     NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- ─── Class schedules ─────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS class_schedules (
  id        INT AUTO_INCREMENT PRIMARY KEY,
  class_id  INT NOT NULL,
  schedule  VARCHAR(100) NOT NULL,
  FOREIGN KEY (class_id) REFERENCES classes(id) ON DELETE CASCADE
);

-- ─── Enrollments (users ↔ classes) ───────────────────────────────────────────
CREATE TABLE IF NOT EXISTS enrollments (
  id         INT AUTO_INCREMENT PRIMARY KEY,
  user_id    INT NOT NULL,
  class_id   INT NOT NULL,
  enrolled_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  UNIQUE KEY uq_enrollment (user_id, class_id),
  FOREIGN KEY (user_id)  REFERENCES users(id)   ON DELETE CASCADE,
  FOREIGN KEY (class_id) REFERENCES classes(id)  ON DELETE CASCADE
);

-- ─── Classworks ──────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS classworks (
  id          INT AUTO_INCREMENT PRIMARY KEY,
  class_id    INT NOT NULL,
  title       VARCHAR(200) NOT NULL,
  total_items INT          NOT NULL DEFAULT 100,
  created_at  DATETIME     NOT NULL DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (class_id) REFERENCES classes(id) ON DELETE CASCADE
);

-- ─── Scores ──────────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS scores (
  id           INT AUTO_INCREMENT PRIMARY KEY,
  user_id      INT NOT NULL,
  classwork_id INT NOT NULL,
  score        DECIMAL(6,2) NOT NULL DEFAULT 0,
  UNIQUE KEY uq_score (user_id, classwork_id),
  FOREIGN KEY (user_id)      REFERENCES users(id)      ON DELETE CASCADE,
  FOREIGN KEY (classwork_id) REFERENCES classworks(id)  ON DELETE CASCADE
);

-- ─── Notifications ───────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS notifications (
  id         INT AUTO_INCREMENT PRIMARY KEY,
  user_id    INT NOT NULL,
  message    TEXT NOT NULL,
  is_read    TINYINT(1) NOT NULL DEFAULT 0,
  created_at DATETIME   NOT NULL DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- ═══════════════════════════════════════════════════════════════════════════
-- SEED DATA – Dummy records
-- ═══════════════════════════════════════════════════════════════════════════

-- Users (password = MD5 of plain text shown in comment)
INSERT IGNORE INTO users (sr_code, name, full_name, username, email, `password(md5)`, section, year_level, course) VALUES
('23-72068', 'Margarette Perez',  'Margarette Perez',  'margarette.perez', '23-72068@g.batstate-u.edu.ph', MD5('password123'), 'BSIT BA-3103', 3, 'BSIT'),
('23-00512', 'Juan Dela Cruz',    'Juan Dela Cruz',    'juan.delacruz',   '23-00512@g.batstate-u.edu.ph', MD5('pass1234'),    'BSCS BA-3101', 3, 'BSCS'),
('22-10341', 'Ana Reyes',         'Ana Reyes',         'ana.reyes',       '22-10341@g.batstate-u.edu.ph', MD5('ana12345'),    'BSIT BA-3104', 3, 'BSIT');

-- Classes
INSERT IGNORE INTO classes (code, subject_name, course_code, instructor, school_year, semester, status, banner_color) VALUES
('ag08itoc', 'WEB SYSTEMS AND TECHNOLOGIES',                     'BSIT BA-3103', 'Jason C. Magsino', '2025-2026', 'First Semester',  'Archived', '#5d6d7e'),
('ag09adet', 'APPLICATION DEVELOPMENT AND EMERGING TECHNOLOGIES','BSIT BA-3303', 'Jason C. Magsino', '2025-2026', 'Midterm',         'Active',   '#2e86c1'),
('bm03dsaa', 'DATA STRUCTURES AND ALGORITHMS',                   'BSCS BA-3101', 'Maria B. Santos',  '2025-2026', 'Second Semester', 'Active',   '#8e44ad'),
('cx11dbms', 'DATABASE MANAGEMENT SYSTEMS',                      'BSIT BA-3103', 'Roberto L. Torres','2024-2025', 'First Semester',  'Archived', '#5d6d7e');

-- Schedules
INSERT IGNORE INTO class_schedules (class_id, schedule) VALUES
(1, 'Tuesday: 02:00 PM - 04:00 PM'),
(1, 'Friday: 04:00 PM - 07:00 PM'),
(2, 'Monday: 01:00 PM - 06:00 PM'),
(2, 'Wednesday: 01:00 PM - 06:00 PM'),
(2, 'Saturday: 07:00 AM - 12:00 PM'),
(3, 'Monday: 08:00 AM - 10:00 AM'),
(3, 'Thursday: 08:00 AM - 10:00 AM'),
(4, 'Tuesday: 10:00 AM - 12:00 PM'),
(4, 'Friday: 10:00 AM - 12:00 PM');

-- Enrollments (user 1 in classes 1,2; user 2 in class 3)
INSERT IGNORE INTO enrollments (user_id, class_id) VALUES (1,1),(1,2),(2,3);

-- Classworks for ag08itoc (class_id=1)
INSERT IGNORE INTO classworks (class_id, title, total_items) VALUES
(1, 'HTML Activity 1', 100),
(1, 'HTML Activity 2 & Assignment 1', 100),
(1, 'HTML and CSS Quiz 1', 20),
(1, 'CSS Activity', 100),
(1, 'Bootstrap Activity', 100),
(1, 'Midterm Examination Results', 60),
(1, 'Midterm Lab Exam Result', 100),
(1, 'PHP MySQL, Session, CRUD with Login and Logout features', 100),
(1, 'Chapter Test', 30);

-- Classworks for ag09adet (class_id=2)
INSERT IGNORE INTO classworks (class_id, title, total_items) VALUES
(2, 'React Native Setup Activity', 50),
(2, 'Expo Go Introduction Quiz', 20),
(2, 'Navigation and Routing Lab', 100);

-- Classworks for bm03dsaa (class_id=3)
INSERT IGNORE INTO classworks (class_id, title, total_items) VALUES
(3, 'Linked List Implementation', 50),
(3, 'Sorting Algorithms Quiz', 25);

-- Scores for user 1 (Margarette)
INSERT IGNORE INTO scores (user_id, classwork_id, score) VALUES
(1,1,90),(1,2,100),(1,3,14),(1,4,92),(1,5,74),(1,6,40),(1,7,100),(1,8,85),(1,9,18),
(1,10,48),(1,11,17),(1,12,88);

-- Scores for user 2 (Juan)
INSERT IGNORE INTO scores (user_id, classwork_id, score) VALUES
(2,13,47),(2,14,20);

-- Notifications
INSERT IGNORE INTO notifications (user_id, message) VALUES
(1, 'New classwork posted in Web Systems and Technologies'),
(1, 'Your score for HTML Activity 1 has been released'),
(1, 'Reminder: Bootstrap Activity due tomorrow'),
(1, 'Class schedule updated for ADET');
