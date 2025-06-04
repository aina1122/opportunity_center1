import mysql from 'mysql2/promise';
import dotenv from 'dotenv';

dotenv.config();

// Create the database connection pool
const pool = mysql.createPool({
  host: process.env.DB_HOST || 'localhost',
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || '',
  database: process.env.DB_NAME || 'opportunity_center',
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
});

// Test the database connection
async function testConnection() {
  try {
    const connection = await pool.getConnection();
    console.log('Database connection successful');
    connection.release();
    return true;
  } catch (error) {
    console.error('Database connection failed:', error);
    return false;
  }
}

// Execute a query with parameters
async function query(sql: string, params: any[] = []) {
  try {
    const [results] = await pool.execute(sql, params);
    return results;
  } catch (error) {
    console.error('Error executing query:', error);
    throw error;
  }
}

// Get a single row by ID
async function getById(table: string, id: number) {
  try {
    const [rows] = await pool.execute(`SELECT * FROM ${table} WHERE id = ?`, [id]);
    return rows[0] || null;
  } catch (error) {
    console.error(`Error getting ${table} by ID:`, error);
    throw error;
  }
}

// Insert a new row
// async function insert(table: string, data: Record<string, any>) {
//   try {
//     const keys = Object.keys(data);
//     const values = Object.values(data);
//     const placeholders = keys.map(() => '?').join(', ');
    
//     const sql = `INSERT INTO ${table} (${keys.join(', ')}) VALUES (${placeholders})`;
//     const [result]: any = await pool.execute(sql, values);
    
//     return {
//       id: result.insertId,
//       ...data
//     };
//   } catch (error) {
//     console.error(`Error inserting into ${table}:`, error);
//     throw error;
//   }
// }
async function insert(table: string, data: Record<string, any>) {
  try {
    const keys = Object.keys(data);
    const values = Object.values(data);
    const placeholders = values.map((v) => (v === null ? 'NULL' : '?')).join(', ');
    const sql = `INSERT INTO ${table} (${keys.join(', ')}) VALUES (${placeholders})`;

    const filteredValues = values.filter((v) => v !== null); // Only pass non-null values
    const [result]: any = await pool.execute(sql, filteredValues);

    return {
      id: result.insertId,
      ...data
    };
  } catch (error) {
    console.error(`Error inserting into ${table}:`, error);
    throw error;
  }
}


// Update an existing row
async function update(table: string, id: number, data: Record<string, any>) {
  try {
    const keys = Object.keys(data);
    const values = Object.values(data);
    
    const setClause = keys.map(key => `${key} = ?`).join(', ');
    const sql = `UPDATE ${table} SET ${setClause} WHERE id = ?`;
    
    await pool.execute(sql, [...values, id]);
    return { id, ...data };
  } catch (error) {
    console.error(`Error updating ${table}:`, error);
    throw error;
  }
}

// Delete a row
async function remove(table: string, id: number) {
  try {
    await pool.execute(`DELETE FROM ${table} WHERE id = ?`, [id]);
    return { success: true };
  } catch (error) {
    console.error(`Error deleting from ${table}:`, error);
    throw error;
  }
}

export default {
  query,
  getById,
  insert,
  update,
  remove,
  testConnection,
  pool
};