import { useState } from 'react'
import { members } from '../data/members'
import './ContributorForm.css'

function ContributorForm({ onAdd }) {
  const [name, setName] = useState('')
  const [amount, setAmount] = useState('')
  const [cleared, setCleared] = useState(false)
  const [submitting, setSubmitting] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (name.trim() && amount > 0) {
      try {
        setSubmitting(true)
        await onAdd(name, amount, cleared)
        setName('')
        setAmount('')
        setCleared(false)
      } finally {
        setSubmitting(false)
      }
    }
  }

  return (
    <div className="contributor-form">
      <h2>Add Contributor</h2>
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="name">Name:</label>
          <input
            type="text"
            id="name"
            list="members-list"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Enter contributor name"
            required
          />
          <datalist id="members-list">
            {members.map(member => (
              <option key={member} value={member} />
            ))}
          </datalist>
        </div>

        <div className="form-group">
          <label htmlFor="amount">Amount (RWF):</label>
          <input
            type="number"
            id="amount"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            placeholder="Enter amount"
            min="0"
            step="0.01"
            required
          />
        </div>

        <div className="form-group checkbox-group">
          <label htmlFor="cleared">
            <input
              type="checkbox"
              id="cleared"
              checked={cleared}
              onChange={(e) => setCleared(e.target.checked)}
            />
            Contribution Cleared (Paid)
          </label>
        </div>

        <button type="submit" className="submit-btn" disabled={submitting}>
          {submitting ? 'Saving...' : 'Add Contributor'}
        </button>
      </form>
    </div>
  )
}

export default ContributorForm
