import db from '.'
import { PoolConnection } from 'mariadb'


// TO-DO: replace any
export async function query(queries: Array<string>): Promise<any> {
  let conn: PoolConnection | undefined
  try {
    conn = await db.getConnection()
    if (conn && 'query' in conn) {
      await conn.query('use dashboard;')
      return Promise.all(queries.map(async queryStr => await conn!.query(queryStr)))
    }
  } catch (e) {
    console.error(e)
    return Promise.reject(e)
  } finally {
    if (conn) conn.end()
  }
}

export async function queryUser(user?: string) {
  try {
    const response = await query([`SELECT * FROM user WHERE username = "${user}"`])

    if (response[0][0]) {
      const { id, name, username, email, token, session_count } = response[0][0]

      return {
        id,
        name,
        username,
        email,
        token,
        sessionCount: session_count
      }
    }
    return null
  } catch (error) {
    console.error(error)
    return null
  }
}

export async function showTables(): Promise<Array<string>> {
  const result = await query(['SHOW TABLES;'])
  console.log('showTables: ', result)
  return result[0] && Array.isArray(result[0]) ? result[0].map((obj: { Tables_in_dashboard: string }) => obj['Tables_in_dashboard']) : []
}

export async function createTable(tableName: string, columns: Array<string>) {
  try {
    console.log(`✍️  Creating ${tableName} table...`)
    const queryList = [`DROP TABLE IF EXISTS ${tableName};`, `CREATE TABLE ${tableName} (${columns}) CHARACTER SET "utf8mb4" ;`, 'SHOW TABLES;']
    const tables = await query(queryList)
    console.log(tables)
    return tables
  } catch (e) {
    console.error(e)
    throw e
  }
}

export async function setUpTables() {
  const tables = await showTables()
  console.log('setUpTables: ', tables)

  if (!tables.includes('user')) {
    const fields = [
      'id INT NOT NULL AUTO_INCREMENT PRIMARY KEY',
      'name NVARCHAR(255)',
      'username NVARCHAR(255)',
      'email NVARCHAR(255)',
      'token NVARCHAR(255)',
      'session_count INT DEFAULT(0)',
      'photo BLOB'
    ]
    await createTable('user', fields)
  }
  if (!tables.includes('user_news')) {
    await createTable('user_news', [
      'user_id INT NOT NULL',
      'news_id INT PRIMARY KEY'
    ])
  }
  if (!tables.includes('news')) {
    const fields = [
      'id INT NOT NULL AUTO_INCREMENT PRIMARY KEY',
      'author_id INT',
      'author NVARCHAR(255)',
      'created_at DATETIME',
      'updated_at DATETIME',
      'title VARCHAR(255)',
      'description VARCHAR(4000)',
      'link NVARCHAR(255)',
      'type NVARCHAR(255)'
    ]
    await createTable('news', fields)
  }
  if (!tables.includes('announcements')) {
    const fields = [
      'id INT NOT NULL AUTO_INCREMENT PRIMARY KEY',
      'author_id INT',
      'author NVARCHAR(255)',
      'created_at DATETIME DEFAULT CURRENT_TIMESTAMP',
      'text VARCHAR(255)',
      'is_urgent BOOLEAN'
    ]
    await createTable('announcements', fields)
  }
  if (!tables.includes('user_announcement')) {
    await createTable('user_announcement', [
      'user_id INT NOT NULL',
      'announcement_id INT PRIMARY KEY'
    ])
  }
  if (!tables.includes('roles')) {
    await createTable('roles', [
      'id INT NOT NULL AUTO_INCREMENT PRIMARY KEY',
      'title NVARCHAR(255)'
    ])
  }
  if (!tables.includes('user_roles')) {
    await createTable('user_roles', [
      'user_id INT',
      'role_id INT',
      'FOREIGN KEY (user_id) REFERENCES user(id)',
      'FOREIGN KEY (role_id) REFERENCES roles(id)'
    ])
  }

  return 'Finished setting up tables'
}
