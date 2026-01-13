import { getPool, serializeContributor } from '../_db.js'

export default async function handler(req, res) {
  const {
    query: { id },
    method
  } = req

  const pool = getPool()

  if (!id) {
    return res.status(400).json({ error: 'Missing contributor id' })
  }

  if (method === 'PATCH') {
    try {
      const { name, amount, cleared } = req.body || {}

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

      return res.status(200).json(serializeContributor(rows[0]))
    } catch (error) {
      console.error('Error updating contributor (serverless)', error)
      return res.status(500).json({ error: 'Failed to update contributor' })
    }
  }

  if (method === 'DELETE') {
    try {
      const { rowCount } = await pool.query(
        'DELETE FROM money_contributions.contributions WHERE id = $1',
        [id]
      )

      if (rowCount === 0) {
        return res.status(404).json({ error: 'Contributor not found' })
      }

      return res.status(204).end()
    } catch (error) {
      console.error('Error deleting contributor (serverless)', error)
      return res.status(500).json({ error: 'Failed to delete contributor' })
    }
  }

  res.setHeader('Allow', ['PATCH', 'DELETE'])
  return res.status(405).json({ error: 'Method Not Allowed' })
}

