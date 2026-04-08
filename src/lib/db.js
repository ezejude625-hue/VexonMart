// ============================================================
// DATABASE UTILITY — src/lib/db.js
// ============================================================
// Singleton MySQL connection pool.
// Import { query, execute, transaction, paginate } as needed.
// ============================================================

import mysql from 'mysql2/promise'

/* ─── Pool config ────────────────────────────────────────── */

// All connection options come from environment variables
const poolConfig = {
  host:               process.env.DB_HOST     || 'localhost',
  port:               parseInt(process.env.DB_PORT || '3306'),
  user:               process.env.DB_USER     || 'root',
  password:           process.env.DB_PASSWORD || '',
  database:           process.env.DB_NAME     || 'vexonmart',
  waitForConnections: true,  // Queue queries when pool is full
  connectionLimit:    10,    // Max simultaneous connections
  queueLimit:         0,     // Unlimited queue
  timezone:           'Z',   // UTC
  charset:            'utf8mb4',
}

/* ─── Singleton pool ─────────────────────────────────────── */

// One pool instance shared across all hot-reloads in dev
let pool = null

function getPool() {
  if (!pool) pool = mysql.createPool(poolConfig)
  return pool
}

/* ─── query() ────────────────────────────────────────────── */
// Execute a parameterised SELECT and return an array of rows.
// Example: const users = await query('SELECT * FROM users WHERE id = ?', [id])
export async function query(sql, params = []) {
  const db = getPool()
  const [rows] = await db.execute(sql, params)
  return rows
}

/* ─── execute() ──────────────────────────────────────────── */
// Execute an INSERT / UPDATE / DELETE.
// Returns the ResultSetHeader (gives insertId, affectedRows, etc.)
export async function execute(sql, params = []) {
  const db = getPool()
  const [result] = await db.execute(sql, params)
  return result
}

/* ─── transaction() ──────────────────────────────────────── */
// Run multiple queries atomically.
// All succeed together or all roll back on error.
// Example:
//   await transaction(async (conn) => {
//     await conn.execute('INSERT INTO orders ...', [...])
//     await conn.execute('UPDATE products SET stock = stock - 1 ...', [...])
//   })
export async function transaction(fn) {
  const db   = getPool()
  const conn = await db.getConnection()
  try {
    await conn.beginTransaction()  // Start
    const result = await fn(conn)  // Run caller's logic
    await conn.commit()            // Commit on success
    return result
  } catch (err) {
    await conn.rollback()          // Roll back on any error
    throw err
  } finally {
    conn.release()                 // Always return to pool
  }
}

/* ─── findById() ─────────────────────────────────────────── */
// Convenience: fetch one row by primary key.
// Returns null if nothing found.
export async function findById(table, id) {
  const rows = await query(`SELECT * FROM \`${table}\` WHERE id = ? LIMIT 1`, [id])
  return rows[0] ?? null
}

/* ─── paginate() ─────────────────────────────────────────── */
// Attach LIMIT/OFFSET to any base query and also count total rows.
// Returns { data, total } for building pagination UI.
export async function paginate(baseSql, params = [], page = 1, limit = 20) {
  // Count total matching rows (same WHERE, no LIMIT)
  const countSql        = `SELECT COUNT(*) AS total FROM (${baseSql}) AS _c`
  const [{ total }]     = await query(countSql, params)

  // Fetch just this page
  const offset  = (page - 1) * limit
  const dataSql = `${baseSql} LIMIT ${limit} OFFSET ${offset}`
  const data    = await query(dataSql, params)

  return { data, total }
}

export default getPool
