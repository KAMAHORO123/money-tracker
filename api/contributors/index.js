import { getPool, serializeContributor } from '../_db.js'

export default async function handler(req, res) {
  const pool = getPool()

  if (req.method === 'GET') {
    try {
      const { rows } = await pool.query(
        'SELECT id, name, amount, cleared FROM money_contributions.contributions ORDER BY id DESC'
      )
      return res.status(200).json(rows.map(serializeContributor))
    } catch (error) {
      console.error('Error fetching contributors (serverless)', error)
      return res.status(500).json({ error: 'Failed to fetch contributors' })
    }
  }

  if (req.method === 'POST') {
    try {
      const { name, amount, cleared = false } = req.body || {}
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

      return res.status(201).json(serializeContributor(rows[0]))
    } catch (error) {
      console.error('Error creating contributor (serverless)', error)
      return res.status(500).json({ error: 'Failed to create contributor' })
    }
  }

  res.setHeader('Allow', ['GET', 'POST'])
  return res.status(405).json({ error: 'Method Not Allowed' })
}

