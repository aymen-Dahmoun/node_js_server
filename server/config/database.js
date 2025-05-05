
import { neon } from '@neondatabase/serverless';
import dotenv from 'dotenv';

dotenv.config();
const { PGUSER, PGPASSWORD, PGHOST, PGDATABASE } = process.env;

export const db = neon(
  `postgresql://${PGUSER}:${PGPASSWORD}@${PGHOST}/${PGDATABASE}?sslmode=require`,
);