import { Pool } from 'pg';

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false },
});

export async function initDb() {
  try {
    await pool.query(`
      CREATE TABLE IF NOT EXISTS users (
        id SERIAL PRIMARY KEY,
        email VARCHAR(255) UNIQUE NOT NULL,
        password VARCHAR(255) NOT NULL,
        name VARCHAR(255),
        is_premium BOOLEAN DEFAULT FALSE,
        downloads_today INT DEFAULT 0,
        last_download_date DATE,
        created_at TIMESTAMP DEFAULT NOW()
      );

      CREATE TABLE IF NOT EXISTS resumes (
        id SERIAL PRIMARY KEY,
        user_id INT REFERENCES users(id) ON DELETE CASCADE,
        template VARCHAR(50),
        data JSONB,
        created_at TIMESTAMP DEFAULT NOW()
      );
    `);
    console.log('Database tables initialized');
  } catch (err) {
    console.error('Database initialization error:', err);
  }
}

export default pool;