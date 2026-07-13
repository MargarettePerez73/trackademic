import cors from 'cors';
import { createHash } from 'crypto';
import type { Request, Response } from 'express';
import express from 'express';
import mysql from 'mysql2/promise';

const app = express();

app.use(cors());
app.use(express.json({ limit: '1mb' }));
app.use(express.urlencoded({ extended: true }));

function getDbConfig() {
  return {
    host:     process.env.DB_HOST     ?? 'localhost',
    port:     Number(process.env.DB_PORT ?? 3306),
    user:     process.env.DB_USER     ?? 'root',
    password: process.env.DB_PASSWORD ?? '',
    database: process.env.DB_NAME     ?? 'sample_db',
  };
}

function md5Hex(input: string) {
  return createHash('md5').update(input, 'utf8').digest('hex');
}

// ─── POST /api/register ────────────────────────────────────────────────────
app.post('/api/register', async (req: Request, res: Response): Promise<any> => {
  const { sr_code, name, full_name, username, email, password } = req.body;
  if (!sr_code || !name || !full_name || !username || !email || !password) {
    return res.status(400).json({ error: 'All fields are required' });
  }
  try {
    const db = await mysql.createConnection(getDbConfig());
    const hashed = md5Hex(password);
    await db.execute(
      'INSERT INTO users (sr_code, name, full_name, username, email, `password(md5)`, created_at) VALUES (?,?,?,?,?,?,NOW())',
      [sr_code, name, full_name, username, email, hashed],
    );
    await db.end();
    return res.status(201).json({ message: 'Registration successful' });
  } catch (error: any) {
    if (error.code === 'ER_DUP_ENTRY') {
      return res.status(409).json({ error: 'SR Code, username, or email already registered.' });
    }
    return res.status(500).json({ error: error.message });
  }
});

// ─── POST /api/login ───────────────────────────────────────────────────────
app.post('/api/login', async (req: Request, res: Response): Promise<any> => {
  const { email, password } = req.body;
  if (!email || !password) {
    return res.status(400).json({ error: 'All fields are required' });
  }
  try {
    const db = await mysql.createConnection(getDbConfig());
    const [rows]: any = await db.execute(
      'SELECT id, sr_code, name, full_name, username, email, `password(md5)`, section, year_level, course FROM users WHERE email = ? OR username = ?',
      [email, email],
    );
    await db.end();
    if (rows.length === 0) return res.status(400).json({ error: 'Invalid email or password' });
    const user = rows[0];
    if (md5Hex(password) !== user['password(md5)']) {
      return res.status(400).json({ error: 'Invalid email or password' });
    }
    const { 'password(md5)': _pw, ...safeUser } = user;
    return res.status(200).json({ message: 'Login successful', user: safeUser });
  } catch (error: any) {
    return res.status(500).json({ error: error.message });
  }
});

// ─── GET /api/classes ──────────────────────────────────────────────────────
app.get('/api/classes/:userId', async (req: Request, res: Response): Promise<any> => {
  try {
    const db = await mysql.createConnection(getDbConfig());
    const [rows] = await db.execute(
      `SELECT c.id, c.code, c.subject_name, c.course_code, c.instructor,
              c.school_year, c.semester, c.status, c.banner_color,
              GROUP_CONCAT(cs.schedule ORDER BY cs.id SEPARATOR '||') AS schedules
       FROM classes c
       JOIN enrollments e ON e.class_id = c.id AND e.user_id = ?
       LEFT JOIN class_schedules cs ON cs.class_id = c.id
       GROUP BY c.id
       ORDER BY c.status DESC, c.created_at DESC`,
      [req.params.userId],
    );
    await db.end();
    const formatted = (rows as any[]).map((r) => ({
      ...r,
      schedules: r.schedules ? r.schedules.split('||') : [],
    }));
    return res.status(200).json(formatted);
  } catch (error: any) {
    return res.status(500).json({ error: error.message });
  }
});

// ─── POST /api/classes/join ────────────────────────────────────────────────
app.post('/api/classes/join', async (req: Request, res: Response): Promise<any> => {
  const { user_id, class_code } = req.body;
  if (!user_id || !class_code) return res.status(400).json({ error: 'user_id and class_code are required' });
  try {
    const db = await mysql.createConnection(getDbConfig());
    const [cls]: any = await db.execute('SELECT id, subject_name FROM classes WHERE code = ?', [class_code]);
    if (cls.length === 0) { await db.end(); return res.status(404).json({ error: 'Class not found. Check the class code.' }); }
    await db.execute('INSERT IGNORE INTO enrollments (user_id, class_id) VALUES (?,?)', [user_id, cls[0].id]);
    await db.end();
    return res.status(200).json({ message: `Successfully joined ${cls[0].subject_name}` });
  } catch (error: any) {
    return res.status(500).json({ error: error.message });
  }
});

// ─── GET /api/performance/:userId ─────────────────────────────────────────
app.get('/api/performance/:userId', async (req: Request, res: Response): Promise<any> => {
  try {
    const db = await mysql.createConnection(getDbConfig());
    const [rows] = await db.execute(
      `SELECT c.code AS class_code, cw.title, cw.total_items,
              COALESCE(s.score, 0) AS score,
              CONCAT(ROUND(COALESCE(s.score,0)/cw.total_items*100,2),'%') AS average,
              cl.semester, cl.school_year
       FROM classworks cw
       JOIN classes cl ON cl.id = cw.class_id
       JOIN enrollments e ON e.class_id = cl.id AND e.user_id = ?
       LEFT JOIN scores s ON s.classwork_id = cw.id AND s.user_id = ?
       ORDER BY cl.school_year DESC, cl.id, cw.id`,
      [req.params.userId, req.params.userId],
    );
    await db.end();
    return res.status(200).json(rows);
  } catch (error: any) {
    return res.status(500).json({ error: error.message });
  }
});

// ─── GET /api/notifications/:userId ───────────────────────────────────────
app.get('/api/notifications/:userId', async (req: Request, res: Response): Promise<any> => {
  try {
    const db = await mysql.createConnection(getDbConfig());
    const [rows] = await db.execute(
      'SELECT id, message, is_read, created_at FROM notifications WHERE user_id = ? ORDER BY created_at DESC',
      [req.params.userId],
    );
    await db.end();
    return res.status(200).json(rows);
  } catch (error: any) {
    return res.status(500).json({ error: error.message });
  }
});

// ─── PUT /api/profile/:userId ──────────────────────────────────────────────
app.put('/api/profile/:userId', async (req: Request, res: Response): Promise<any> => {
  const { full_name, section, year_level } = req.body;
  try {
    const db = await mysql.createConnection(getDbConfig());
    await db.execute(
      'UPDATE users SET full_name=?, section=?, year_level=? WHERE id=?',
      [full_name, section, year_level, req.params.userId],
    );
    await db.end();
    return res.status(200).json({ message: 'Profile updated successfully' });
  } catch (error: any) {
    return res.status(500).json({ error: error.message });
  }
});

app.listen(3000, '0.0.0.0', () => console.log('Trackademic server running on port 3000'));
