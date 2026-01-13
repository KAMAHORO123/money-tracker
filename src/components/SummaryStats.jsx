import './SummaryStats.css'

function SummaryStats({ totalContributed, totalPending, remaining, goalAmount }) {
  const percentage = goalAmount > 0 ? (totalContributed / goalAmount) * 100 : 0
  const isComplete = totalContributed >= goalAmount

  return (
    <div className="summary-stats">
      <h2>Summary</h2>
      <div className="stats-grid">
        <div className="stat-card contributed">
          <div className="stat-icon">💰</div>
          <div className="stat-content">
            <div className="stat-label">Total Contributed</div>
            <div className="stat-value">{totalContributed.toLocaleString()} RWF</div>
          </div>
        </div>

        <div className="stat-card pending">
          <div className="stat-icon">⏳</div>
          <div className="stat-content">
            <div className="stat-label">Pending</div>
            <div className="stat-value">{totalPending.toLocaleString()} RWF</div>
          </div>
        </div>

        <div className={`stat-card ${isComplete ? 'complete' : 'remaining'}`}>
          <div className="stat-icon">{isComplete ? '🎉' : '📊'}</div>
          <div className="stat-content">
            <div className="stat-label">{isComplete ? 'Goal Reached!' : 'Remaining'}</div>
            <div className="stat-value">
              {isComplete ? 'Complete!' : `${remaining.toLocaleString()} RWF`}
            </div>
          </div>
        </div>

        <div className="stat-card percentage">
          <div className="stat-icon">📈</div>
          <div className="stat-content">
            <div className="stat-label">Progress</div>
            <div className="stat-value">{percentage.toFixed(1)}%</div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default SummaryStats
