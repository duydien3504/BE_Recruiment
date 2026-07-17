// Quick helper script to fetch employer + job IDs from the real DB
require('dotenv').config();
const { Client } = require('pg');

const db = new Client({
    host:     process.env.DB_HOST,
    port:     parseInt(process.env.DB_PORT) || 5432,
    user:     process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    ssl:      { require: true, rejectUnauthorized: false }
});

async function main() {
    await db.connect();

    // Xem tất cả roles có trong DB
    const roles = await db.query('SELECT * FROM roles LIMIT 10');
    console.log('\n📋 Tất cả Roles trong DB:');
    console.log(JSON.stringify(roles.rows, null, 2));

    // Xem employers (join companies + job_posts)
    const result = await db.query(`
        SELECT
            u.user_id,
            u.full_name,
            u.email,
            r.role_name,
            c.name       AS company_name,
            c.company_id,
            j.job_post_id,
            j.title      AS job_title
        FROM users u
        JOIN roles r      ON r.role_id = u.role_id
        JOIN companies c  ON c.user_id = u.user_id
        JOIN job_posts j  ON j.company_id = c.company_id
        LIMIT 5
    `);
    console.log('\n📋 Employer + Jobs có trong DB:');
    console.log(JSON.stringify(result.rows, null, 2));
    console.log('\n💡 Copy user_id và job_post_id vào simulate_apply.js\n');

    await db.end();
}

main().catch(e => { console.error(e.message); process.exit(1); });
