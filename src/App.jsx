import { useState, useEffect } from 'react'
import ContributorForm from './components/ContributorForm'
import ContributorList from './components/ContributorList'
import ProgressChart from './components/ProgressChart'
import SummaryStats from './components/SummaryStats'
import './App.css'

const GOAL_AMOUNT = 1000000 // 1 million Rwandan francs
const PER_PERSON_TARGET = 12000 // Expected contribution per person

function App() {
  const [contributors, setContributors] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  const fetchContributors = async () => {
    try {
      setLoading(true)
      const response = await fetch('/api/contributors')
      if (!response.ok) throw new Error('Failed to load contributors')
      const data = await response.json()
      setContributors(data)
      setError(null)
    } catch (err) {
      console.error(err)
      setError('Could not load contributors from the database.')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchContributors()
  }, [])

  const addContributor = async (name, amount, cleared) => {
    try {
      const response = await fetch('/api/contributors', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name,
          amount: parseFloat(amount),
          cleared: Boolean(cleared)
        })
      })

      if (!response.ok) throw new Error('Failed to add contributor')
      const created = await response.json()
      setContributors(prev => [created, ...prev])
      setError(null)
    } catch (err) {
      console.error(err)
      setError('Could not add contributor. Please try again.')
      throw err
    }
  }

  const updateContributor = async (id, updates) => {
    try {
      const response = await fetch(`/api/contributors/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updates)
      })
      if (!response.ok) throw new Error('Failed to update contributor')
      const updated = await response.json()

      setContributors(prev =>
        prev.map(c => (c.id === id ? { ...c, ...updated } : c))
      )
      setError(null)
    } catch (err) {
      console.error(err)
      setError('Could not update contributor. Please try again.')
      throw err
    }
  }

  const deleteContributor = async (id) => {
    try {
      const response = await fetch(`/api/contributors/${id}`, {
        method: 'DELETE'
      })
      if (!response.ok && response.status !== 204) {
        throw new Error('Failed to delete contributor')
      }
      setContributors(prev => prev.filter(c => c.id !== id))
      setError(null)
    } catch (err) {
      console.error(err)
      setError('Could not delete contributor. Please try again.')
      throw err
    }
  }

  const totalContributed = contributors
    .filter(c => c.cleared)
    .reduce((sum, c) => sum + c.amount, 0)

  const totalPending = contributors
    .filter(c => !c.cleared)
    .reduce((sum, c) => sum + c.amount, 0)

  const remaining = Math.max(0, GOAL_AMOUNT - totalContributed)

  return (
    <div className="app">
      <header className="app-header">
        <h1>Contribution Tracking System</h1>
        <p className="goal-text">Goal: {GOAL_AMOUNT.toLocaleString()} RWF</p>
      </header>

      {error && <div className="status-banner error">{error}</div>}
      {loading && <div className="status-banner info">Loading contributors from the database...</div>}

      <div className="app-content">
        <div className="left-panel">
          <SummaryStats 
            totalContributed={totalContributed}
            totalPending={totalPending}
            remaining={remaining}
            goalAmount={GOAL_AMOUNT}
          />
          <ProgressChart 
            totalContributed={totalContributed}
            goalAmount={GOAL_AMOUNT}
          />
        </div>

        <div className="right-panel">
          <ContributorForm onAdd={addContributor} />
          <ContributorList 
            contributors={contributors}
            onUpdate={updateContributor}
            onDelete={deleteContributor}
            remaining={remaining}
            totalContributed={totalContributed}
            totalPending={totalPending}
            goalAmount={GOAL_AMOUNT}
            perPersonTarget={PER_PERSON_TARGET}
            loading={loading}
          />
        </div>
      </div>
    </div>
  )
}

export default App
