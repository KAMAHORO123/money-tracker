import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from 'recharts'
import './ProgressChart.css'

function ProgressChart({ totalContributed, goalAmount }) {
  const remaining = Math.max(0, goalAmount - totalContributed)
  const percentage = goalAmount > 0 ? (totalContributed / goalAmount) * 100 : 0

  const data = [
    { name: 'Contributed', value: totalContributed },
    { name: 'Remaining', value: remaining }
  ]

  const COLORS = ['#10b981', '#e5e7eb']

  return (
    <div className="progress-chart">
      <h2>Progress Overview</h2>
      <div className="chart-container">
        <ResponsiveContainer width="100%" height={300}>
          <PieChart>
            <Pie
              data={data}
              cx="50%"
              cy="50%"
              labelLine={false}
              label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(1)}%`}
              outerRadius={100}
              fill="#8884d8"
              dataKey="value"
            >
              {data.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
              ))}
            </Pie>
            <Tooltip 
              formatter={(value) => `${value.toLocaleString()} RWF`}
            />
            <Legend />
          </PieChart>
        </ResponsiveContainer>
      </div>
      <div className="progress-bar-container">
        <div className="progress-bar-label">
          <span>Progress: {percentage.toFixed(1)}%</span>
          <span>{totalContributed.toLocaleString()} / {goalAmount.toLocaleString()} RWF</span>
        </div>
        <div className="progress-bar">
          <div 
            className="progress-bar-fill" 
            style={{ width: `${Math.min(percentage, 100)}%` }}
          ></div>
        </div>
      </div>
    </div>
  )
}

export default ProgressChart
