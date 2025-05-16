import mysql from 'mysql2/promise';

const createDatabaseAndTables = async () => {
  const connection = await mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: ''
  });

  await connection.query(`CREATE DATABASE IF NOT EXISTS bwd CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci`);
  await connection.query(`USE bwd`);

  // users table
  await connection.query(`
    CREATE TABLE IF NOT EXISTS users (
      id INT(11) NOT NULL AUTO_INCREMENT,
      username VARCHAR(100) NOT NULL UNIQUE,
      name VARCHAR(100),
      email VARCHAR(100),
      password VARCHAR(255) DEFAULT NULL,
      auth_provider VARCHAR(50) DEFAULT 'local',
      avatar LONGBLOB,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      PRIMARY KEY (id)
    ) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci;
  `);

  // user_profiles table
  await connection.query(`
    CREATE TABLE IF NOT EXISTS user_profiles (
      user_id INT PRIMARY KEY,
      about_me TEXT,
      facebook_url VARCHAR(255),
      twitter_url VARCHAR(255),
      instagram_url VARCHAR(255),
      google_url VARCHAR(255),
      FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
    );
  `);

  // trigger tạo profile tự động
  await connection.query(`DROP TRIGGER IF EXISTS create_user_profile`);
  await connection.query(`
    CREATE TRIGGER create_user_profile
    AFTER INSERT ON users
    FOR EACH ROW
    BEGIN
      INSERT INTO user_profiles (user_id) VALUES (NEW.id);
    END;
  `);

  // đảm bảo user_profiles đầy đủ cho user hiện có
  await connection.query(`
    INSERT INTO user_profiles (user_id)
    SELECT id FROM users
    WHERE id NOT IN (SELECT user_id FROM user_profiles);
  `);

  // posts table
  await connection.query(`
    CREATE TABLE IF NOT EXISTS posts (
      id INT AUTO_INCREMENT PRIMARY KEY,
      content TEXT,
      images JSON,
      author_id INT,
      author_name VARCHAR(100),
      author_avatar TEXT,
      likes INT DEFAULT 0,
      comments JSON,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (author_id) REFERENCES users(id) ON DELETE SET NULL
    ) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci;
  `);

  // post_likes table
  await connection.query(`
    CREATE TABLE IF NOT EXISTS post_likes (
      post_id INT,
      user_id INT,
      PRIMARY KEY (post_id, user_id),
      FOREIGN KEY (post_id) REFERENCES posts(id) ON DELETE CASCADE,
      FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
    );
  `);

  console.log('✅ Database và các bảng đã được tạo thành công!');
  await connection.end();
};

createDatabaseAndTables().catch(err => {
  console.error('❌ Lỗi khi tạo DB:', err);
});

export default createDatabaseAndTables;