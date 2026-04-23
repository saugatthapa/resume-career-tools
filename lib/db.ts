import { Pool } from 'pg';

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false },
});

const initDb = async () => {
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

    const cols = await pool.query(`
      SELECT column_name FROM information_schema.columns 
      WHERE table_name = 'users' AND column_name = 'password'
    `);
    
    if (cols.rows.length === 0) {
      await pool.query('ALTER TABLE users ADD COLUMN password VARCHAR(255)');
      console.log('Added password column');
    }

    console.log('Database tables initialized');
  } catch (err) {
    console.error('Database initialization error:', err);
  }
};

initDb();

export default pool;