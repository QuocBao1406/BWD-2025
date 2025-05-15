import mysql from 'mysql2/promise';

const pool = mysql.createPool({
  host: 'localhost',
  user: 'root',
  password: '',
  database: 'bwd',
});

export const query = (sql, params) => {
  return pool.execute(sql, params);
};