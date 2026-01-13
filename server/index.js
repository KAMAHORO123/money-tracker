import express from 'express'
import cors from 'cors'
import dotenv from 'dotenv'
import { Pool } from 'pg'

dotenv.config()

const app = express()
const PORT = process.env.PORT || 4000
const DATABASE_URL = process.env.DATABASE_URL

if (!DATABASE_URL) {
  console.error('DATABASE_URL is not set. Add it to your .env file.')
  process.exit(1)
}

const pool = new Pool({
  connectionString: DATABASE_URL,
  ssl: { rejectUnauthorized: false }
})

const serializeContributor = (row) => ({
  ...row,
  amount: Number(row.amount),
  cleared: Boolean(row.cleared)
})

app.use(cors())
app.use(express.json())

const ensureTable = async () => {
  // Ensure schema exists, then create table within it
  await pool.query('CREATE SCHEMA IF NOT EXISTS money_contributions')
  await pool.query(`
    CREATE TABLE IF NOT EXISTS money_contributions.contributions (
      id SERIAL PRIMARY KEY,
      name TEXT NOT NULL,
      amount NUMERIC NOT NULL,
      cleared BOOLEAN NOT NULL DEFAULT FALSE,
      created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
    )
  `)
}

app.get('/api/health', (_, res) => {
  res.json({ status: 'ok' })
})

app.get('/api/contributors', async (_req, res) => {
  try {
    const { rows } = await pool.query(
      'SELECT id, name, amount, cleared FROM money_contributions.contributions ORDER BY id DESC'
    )
    res.json(rows.map(serializeContributor))
  } catch (error) {
    console.error('Error fetching contributors', error)
    res.status(500).json({ error: 'Failed to fetch contributors' })
  }
})

app.post('/api/contributors', async (req, res) => {
  try {
    const { name, amount, cleared = false } = req.body
    const parsedAmount = Number(amount)

    if (!name || Number.isNaN(parsedAmount) || parsedAmount < 0) {
      return res.status(400).json({ error: 'Name and a valid amount are required' })
    }

    const { rows } = await pool.query(
      `INSERT INTO money_contributions.contributions (name, amount, cleared)
       VALUES ($1, $2, $3)
       RETURNING id, name, amount, cleared`,
      [name.trim(), parsedAmount, Boolean(cleared)]
    )

    res.status(201).json(serializeContributor(rows[0]))
  } catch (error) {
    console.error('Error creating contributor', error)
    res.status(500).json({ error: 'Failed to create contributor' })
  }
})

app.patch('/api/contributors/:id', async (req, res) => {
  try {
    const { id } = req.params
    const { name, amount, cleared } = req.body

    const updates = []
    const values = []
    let index = 1

    if (typeof name === 'string' && name.trim().length > 0) {
      updates.push(`name = $${index++}`)
      values.push(name.trim())
    }

    if (amount !== undefined) {
      const parsedAmount = Number(amount)
      if (Number.isNaN(parsedAmount) || parsedAmount < 0) {
        return res.status(400).json({ error: 'Amount must be a positive number' })
      }
      updates.push(`amount = $${index++}`)
      values.push(parsedAmount)
    }

    if (cleared !== undefined) {
      updates.push(`cleared = $${index++}`)
      values.push(Boolean(cleared))
    }

    if (updates.length === 0) {
      return res.status(400).json({ error: 'No valid fields provided to update' })
    }

    values.push(id)

    const { rows } = await pool.query(
      `UPDATE money_contributions.contributions
       SET ${updates.join(', ')}
       WHERE id = $${index}
       RETURNING id, name, amount, cleared`,
      values
    )

    if (rows.length === 0) {
      return res.status(404).json({ error: 'Contributor not found' })
    }

    res.json(serializeContributor(rows[0]))
  } catch (error) {
    console.error('Error updating contributor', error)
    res.status(500).json({ error: 'Failed to update contributor' })
  }
})

app.delete('/api/contributors/:id', async (req, res) => {
  try {
    const { id } = req.params
    const { rowCount } = await pool.query('DELETE FROM money_contributions.contributions WHERE id = $1', [id])

    if (rowCount === 0) {
      return res.status(404).json({ error: 'Contributor not found' })
    }

    res.status(204).end()
  } catch (error) {
    console.error('Error deleting contributor', error)
    res.status(500).json({ error: 'Failed to delete contributor' })
  }
})

ensureTable()
  .then(() => {
    app.listen(PORT, () => {
      console.log(`Server listening on port ${PORT}`)
    })
  })
  .catch((error) => {
    console.error('Failed to start server', error)
    process.exit(1)
  })
