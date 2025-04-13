import mysql from 'mysql2/promise';

const pool = mysql.createPool({
    host: "localhost",
    user: "do1904",
    password: "1000freunde",
    database: "stickers"
});

export default pool;