import { useState } from 'react'
import './ContributorList.css'

function ContributorList({ contributors, onUpdate, onDelete, remaining, totalContributed = 0, totalPending = 0, goalAmount = 0, perPersonTarget = 12000, loading = false }) {
  const [editingId, setEditingId] = useState(null)
  const [editAmount, setEditAmount] = useState('')

  if (loading) {
    return (
      <div className="contributor-list">
        <h2>Contributors</h2>
        <p className="empty-message">Loading contributors...</p>
      </div>
    )
  }

  if (contributors.length === 0) {
    return (
      <div className="contributor-list">
        <h2>Contributors</h2>
        <p className="empty-message">No contributors yet. Add one above!</p>
      </div>
    )
  }

  return (
    <div className="contributor-list">
      <h2>Contributors ({contributors.length})</h2>
      <div className="contributors-table">
        <table>
          <thead>
            <tr>
              <th>Name</th>
              <th>Amount (RWF)</th>
              <th>Remaining to 12,000</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {contributors.map(contributor => {
              const isEditing = editingId === contributor.id
              const remainingDue = Math.max(perPersonTarget - contributor.amount, 0)
              return (
                <tr key={contributor.id} className={contributor.cleared ? 'cleared' : 'pending'}>
                  <td>{contributor.name}</td>
                  <td>
                    {isEditing ? (
                      <input
                        type="number"
                        className="edit-input"
                        value={editAmount}
                        onChange={(e) => setEditAmount(e.target.value)}
                        min="0"
                        step="0.01"
                      />
                    ) : (
                      contributor.amount.toLocaleString()
                    )}
                  </td>
                  <td>
                    <span className={`remaining-badge ${remainingDue === 0 ? 'settled' : 'due'}`}>
                      {remainingDue === 0 
                        ? 'Fully Paid' 
                        : `${remainingDue.toLocaleString()} RWF`}
                    </span>
                  </td>
                  <td>
                    <span className={`status-badge ${contributor.cleared ? 'cleared' : 'pending'}`}>
                      {contributor.cleared ? '✓ Cleared' : '⏳ Pending'}
                    </span>
                  </td>
                  <td>
                    {isEditing ? (
                      <>
                        <button
                          onClick={async () => {
                            const parsed = parseFloat(editAmount)
                            if (!Number.isNaN(parsed) && parsed >= 0) {
                              try {
                                await onUpdate(contributor.id, { amount: parsed })
                                setEditingId(null)
                                setEditAmount('')
                              } catch (err) {
                                console.error(err)
                              }
                            }
                          }}
                          className="save-btn"
                        >
                          Save
                        </button>
                        <button
                          onClick={() => {
                            setEditingId(null)
                            setEditAmount('')
                          }}
                          className="cancel-btn"
                        >
                          Cancel
                        </button>
                      </>
                    ) : (
                      <>
                        <button
                          onClick={async () => {
                            try {
                              await onUpdate(contributor.id, { cleared: !contributor.cleared })
                            } catch (err) {
                              console.error(err)
                            }
                          }}
                          className="toggle-btn"
                        >
                          {contributor.cleared ? 'Mark Pending' : 'Mark Cleared'}
                        </button>
                        <button
                          onClick={() => {
                            setEditingId(contributor.id)
                            setEditAmount(contributor.amount.toString())
                          }}
                          className="edit-btn"
                        >
                          Edit
                        </button>
                        <button
                          onClick={async () => {
                            try {
                              await onDelete(contributor.id)
                            } catch (err) {
                              console.error(err)
                            }
                          }}
                          className="delete-btn"
                        >
                          Delete
                        </button>
                      </>
                    )}
                </td>
              </tr>
              )
            })}
          </tbody>
          <tfoot>
            <tr className="summary-row">
              <td colSpan="5">
                <div className="summary-row-content">
                  <div className="summary-item">
                    <span className="summary-label">Cleared Total</span>
                    <strong>{totalContributed.toLocaleString()} RWF</strong>
                  </div>
                  <div className="summary-item">
                    <span className="summary-label">Pending Total</span>
                    <strong>{totalPending.toLocaleString()} RWF</strong>
                  </div>
                  <div className="summary-item">
                    <span className="summary-label">Remaining to Goal</span>
                    <strong>{remaining.toLocaleString()} RWF</strong>
                  </div>
                </div>
                <div className="table-progress">
                  <div className="table-progress-bar">
                    <div 
                      className="table-progress-fill" 
                      style={{ width: `${goalAmount > 0 ? Math.min((totalContributed / goalAmount) * 100, 100) : 0}%` }}
                    ></div>
                  </div>
                  <div className="table-progress-label">
                    Progress: {goalAmount > 0 ? ((totalContributed / goalAmount) * 100).toFixed(1) : '0.0'}%
                  </div>
                </div>
              </td>
            </tr>
          </tfoot>
        </table>
      </div>
      {remaining > 0 && (
        <div className="remaining-info">
          <p>💰 Still need: <strong>{remaining.toLocaleString()} RWF</strong> to reach the goal</p>
        </div>
      )}
    </div>
  )
}

export default ContributorList
