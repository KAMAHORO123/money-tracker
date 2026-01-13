import { Pool } from 'pg'

let pool

export function getPool() {
  if (!pool) {
    const connectionString = process.env.DATABASE_URL
    if (!connectionString) {
      throw new Error('DATABASE_URL is not set in environment variables')
    }

    pool = new Pool({
      connectionString,
      ssl: { rejectUnauthorized: false }
    })
  }

  return pool
}

export const serializeContributor = (row) => ({
  ...row,
  amount: Number(row.amount),
  cleared: Boolean(row.cleared)
})

