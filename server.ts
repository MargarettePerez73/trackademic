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
    host: process.env.DB_HOST ?? 'localhost',
    port: Number(process.env.DB_PORT ?? 3306),
    user: process.env.DB_USER ?? 'root',
    password: process.env.DB_PASSWORD ?? '',
    database: process.env.DB_NAME ?? 'sample_db',
  };
}

function md5Hex(input: string) {
  return createHash('md5').update(input, 'utf8').digest('hex');
}

app.post('/api/register', async (req: Request, res: Response): Promise<any> => {
  const { name, email, password } = req.body;
  if (!name || !email || !password) {
    return res.status(400).json({ error: 'All fields are required' });
  }

  try {
    const connection = await mysql.createConnection(getDbConfig());

    const hashedPasswordMd5 = md5Hex(password);

    await connection.execute(
      'INSERT INTO users (name, email, `password(md5)`, created_at) VALUES (?, ?, ?, NOW())',
      [name, email, hashedPasswordMd5],
    );

    await connection.end();
    return res.status(201).json({ message: 'Registration successful' });
  } catch (error: any) {
    return res.status(500).json({ error: error.message });
  }
});

app.post('/api/login', async (req: Request, res: Response): Promise<any> => {
  const { email, password } = req.body;
  if (!email || !password) {
    return res.status(400).json({ error: 'All fields are required' });
  }

  try {
    const connection = await mysql.createConnection(getDbConfig());
    const [rows]: any = await connection.execute(
      'SELECT id, name, email, `password(md5)` FROM users WHERE email = ?',
      [email],
    );
    await connection.end();

    if (rows.length === 0) {
      return res.status(400).json({ error: 'Invalid email or password' });
    }

    const user = rows[0];
    const hashedPasswordMd5 = md5Hex(password);

    if (hashedPasswordMd5 !== user['password(md5)']) {
      return res.status(400).json({ error: 'Invalid email or password' });
    }

    return res.status(200).json({
      message: 'Login successful',
      user: { id: user.id, name: user.name, email: user.email },

    });
  } catch (error: any) {
    return res.status(500).json({ error: error.message });
  }
});

app.get('/api/users', async (_req: Request, res: Response): Promise<any> => {
  try {
    const connection = await mysql.createConnection(getDbConfig());
    const [rows] = await connection.execute(
      'SELECT id, name as name, email, created_at FROM users',
    );
    await connection.end();
    return res.status(200).json(rows);
  } catch (error: any) {
    return res.status(500).json({ error: error.message });
  }
});

app.listen(3000, '0.0.0.0', () => {
  console.log('Server is running on port 3000');
});