const { Client } = require('pg');

const connectionString = 'postgresql://sushanth:CCGbyQCs1JXTED9L1xhKn12rr6cwS0jK@dpg-d0oldeuuk2gs738q1gs0-a.oregon-postgres.render.com/clouddb_ut36';

const client = new Client({
  connectionString,
  ssl: {
    rejectUnauthorized: false
  }
});

async function createTable() {
  try {
    await client.connect();
    console.log('Connected to PostgreSQL');

    const createTableQuery = `
      CREATE TABLE users (
  id SERIAL PRIMARY KEY,
  username TEXT NOT NULL,
  email TEXT UNIQUE NOT NULL,
  password TEXT NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

    `;

    await client.query(createTableQuery);
    console.log('Table "users" created or already exists.');

  } catch (err) {
    console.error('Error creating table:', err);
  } finally {
    await client.end();
    console.log('Connection closed');
  }
}

createTable();
