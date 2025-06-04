import mysql from 'mysql2/promise';
import dotenv from 'dotenv';

dotenv.config();

// Create a connection pool
const pool = mysql.createPool({
  host: process.env.DB_HOST || 'localhost',
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || '',
  database: process.env.DB_NAME || 'opportunity_center',
  port: process.env.DB_PORT || 3306,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
  enableKeepAlive: true,
  keepAliveInitialDelay: 0
});

// Test the connection
pool.getConnection()
  .then(connection => {
    console.log('Database connected successfully');
    connection.release();
  })
  .catch(error => {
    console.error('Database connection failed:', error);
  });

// Helper function to execute queries with error handling
export async function query(sql, params = []) {
  try {
    const connection = await pool.getConnection();
    try {
      const [rows] = await connection.execute(sql, params);
      return rows;
    } finally {
      connection.release();
    }
  } catch (error) {
    console.error('Database query error:', error);
    throw new Error('Database query failed');
  }
}

// Get a single record by field
export async function getByField(table, field, value) {
  try {
    const rows = await query(`SELECT * FROM ${table} WHERE ${field} = ?`, [value]);
    return rows[0];
  } catch (error) {
    console.error(`Error getting ${table} by ${field}:`, error);
    return null;
  }
}

// Get all records from a table
export async function getAll(table, orderBy = 'id', order = 'DESC', limit = 100, offset = 0) {
  try {
    return await query(
      `SELECT * FROM ${table} ORDER BY ${orderBy} ${order} LIMIT ? OFFSET ?`,
      [limit, offset]
    );
  } catch (error) {
    console.error(`Error getting all records from ${table}:`, error);
    return [];
  }
}

// Count total records
export async function count(table, whereClause = '', params = []) {
  try {
    const sql = `SELECT COUNT(*) as total FROM ${table} ${whereClause ? 'WHERE ' + whereClause : ''}`;
    const result = await query(sql, params);
    return result[0].total;
  } catch (error) {
    console.error(`Error counting records in ${table}:`, error);
    return 0;
  }
}

// Insert a record
export async function insert(table, data) {
  try {
    const keys = Object.keys(data);
    const values = Object.values(data);
    const placeholders = keys.map(() => '?').join(', ');
    
    const sql = `INSERT INTO ${table} (${keys.join(', ')}) VALUES (${placeholders})`;
    const result = await query(sql, values);
    
    return result.insertId;
  } catch (error) {
    console.error(`Error inserting into ${table}:`, error);
    throw error;
  }
}

// Update a record
export async function update(table, id, data) {
  try {
    const keys = Object.keys(data);
    const values = Object.values(data);
    
    const setClause = keys.map(key => `${key} = ?`).join(', ');
    const sql = `UPDATE ${table} SET ${setClause} WHERE id = ?`;
    
    const result = await query(sql, [...values, id]);
    return result.affectedRows;
  } catch (error) {
    console.error(`Error updating ${table}:`, error);
    throw error;
  }
}

// Delete a record
export async function remove(table, id) {
  try {
    const result = await query(`DELETE FROM ${table} WHERE id = ?`, [id]);
    return result.affectedRows;
  } catch (error) {
    console.error(`Error deleting from ${table}:`, error);
    throw error;
  }
}

// Transaction helper
export async function transaction(callback) {
  const connection = await pool.getConnection();
  
  try {
    await connection.beginTransaction();
    const result = await callback(connection);
    await connection.commit();
    return result;
  } catch (error) {
    await connection.rollback();
    throw error;
  } finally {
    connection.release();
  }
}

export default {
  query,
  getByField,
  getAll,
  count,
  insert,
  update,
  remove,
  transaction
};