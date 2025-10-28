#!/usr/bin/env node
/**
 * Database Setup Script
 * 
 * This script sets up the Supabase database tables using the Prisma schema.
 * Run this manually: node scripts/setup-database.js
 */

const { exec } = require('child_process');
const { promisify } = require('util');
const execAsync = promisify(exec);

async function setupDatabase() {
  console.log('🚀 Setting up database...\n');

  try {
    // Generate Prisma Client
    console.log('📦 Generating Prisma Client...');
    await execAsync('npx prisma generate');
    console.log('✅ Prisma Client generated\n');

    // Push schema to database
    console.log('🗄️  Pushing schema to database...');
    const { stdout, stderr } = await execAsync('npx prisma db push --accept-data-loss');
    
    if (stdout) console.log(stdout);
    if (stderr) console.error(stderr);
    
    console.log('✅ Database schema pushed successfully\n');

    console.log('🎉 Database setup complete!');
  } catch (error) {
    console.error('❌ Error setting up database:', error.message);
    if (error.stdout) console.log(error.stdout);
    if (error.stderr) console.error(error.stderr);
    process.exit(1);
  }
}

setupDatabase();
