#!/usr/bin/env node

/**
 * Script to help encode DATABASE_URL for Prisma
 *
 * Usage: node scripts/encode-db-url.js
 *
 * This will prompt you to enter your database URL components and output
 * a properly encoded connection string.
 */

const readline = require('readline');

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

function encodePassword(password) {
  // URL encode the password
  return encodeURIComponent(password);
}

console.log('\n=== Database URL Encoder for Prisma ===\n');
console.log('This will help you create a properly encoded DATABASE_URL.\n');

rl.question('Database host (e.g., db.abc123xyz.supabase.co): ', (host) => {
  rl.question('Database port (6543 for Supabase pooler, 5432 for direct): ', (port) => {
    rl.question('Database username (usually "postgres" for Supabase): ', (username) => {
      rl.question('Database password: ', (password) => {
        rl.question('Database name (usually "postgres" for Supabase): ', (dbName) => {

          const encodedPassword = encodePassword(password);
          const usePooler = port === '6543';
          const poolerParam = usePooler ? '?pgbouncer=true' : '';

          const connectionString = `postgresql://${username}:${encodedPassword}@${host}:${port}/${dbName}${poolerParam}`;

          console.log('\n=== Your Encoded DATABASE_URL ===\n');
          console.log(connectionString);
          console.log('\n=== Instructions ===\n');
          console.log('1. Copy the connection string above');
          console.log('2. In Vercel, go to: Project Settings → Environment Variables');
          console.log('3. Find or create DATABASE_URL');
          console.log('4. Paste the connection string');
          console.log('5. Save and redeploy\n');

          if (!usePooler) {
            console.log('⚠️  WARNING: You are not using the connection pooler (port 6543)');
            console.log('   This may cause "prepared statement already exists" errors.');
            console.log('   Consider using port 6543 for Supabase.\n');
          }

          rl.close();
        });
      });
    });
  });
});
