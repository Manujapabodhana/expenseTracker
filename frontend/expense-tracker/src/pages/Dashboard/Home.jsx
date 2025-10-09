import React, { useContext } from 'react'
import { useNavigate } from 'react-router-dom'
import { UserContext } from '../../context/userContext'

function Home() {
  const { user, clearUser } = useContext(UserContext)
  const navigate = useNavigate()

  const handleLogout = () => {
    clearUser()
    navigate('/login')
  }

  return (
    <div style={{ minHeight: '100vh', padding: '20px', backgroundColor: '#f8f9fa' }}>
      <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
          <h1 style={{ fontSize: '2rem', fontWeight: 'bold', color: '#333' }}>Dashboard</h1>
          <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
            {user && <span style={{ color: '#666' }}>Welcome, {user.fullName || user.email}</span>}
            <button 
              onClick={handleLogout}
              style={{ 
                padding: '8px 16px', 
                backgroundColor: '#dc3545', 
                color: 'white', 
                border: 'none', 
                borderRadius: '4px', 
                cursor: 'pointer' 
              }}
            >
              Logout
            </button>
          </div>
        </div>
        
        {/* Summary Cards */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '20px', marginBottom: '30px' }}>
          <div style={{ backgroundColor: 'white', padding: '20px', borderRadius: '8px', boxShadow: '0 2px 4px rgba(0,0,0,0.1)', borderLeft: '4px solid #28a745' }}>
            <h3 style={{ fontSize: '1.1rem', color: '#666', marginBottom: '10px' }}>Total Income</h3>
            <p style={{ fontSize: '2rem', fontWeight: 'bold', color: '#28a745', margin: '0' }}>$0.00</p>
          </div>
          <div style={{ backgroundColor: 'white', padding: '20px', borderRadius: '8px', boxShadow: '0 2px 4px rgba(0,0,0,0.1)', borderLeft: '4px solid #dc3545' }}>
            <h3 style={{ fontSize: '1.1rem', color: '#666', marginBottom: '10px' }}>Total Expenses</h3>
            <p style={{ fontSize: '2rem', fontWeight: 'bold', color: '#dc3545', margin: '0' }}>$0.00</p>
          </div>
          <div style={{ backgroundColor: 'white', padding: '20px', borderRadius: '8px', boxShadow: '0 2px 4px rgba(0,0,0,0.1)', borderLeft: '4px solid #007bff' }}>
            <h3 style={{ fontSize: '1.1rem', color: '#666', marginBottom: '10px' }}>Balance</h3>
            <p style={{ fontSize: '2rem', fontWeight: 'bold', color: '#007bff', margin: '0' }}>$0.00</p>
          </div>
        </div>

        {/* Quick Actions */}
        <div style={{ backgroundColor: 'white', padding: '20px', borderRadius: '8px', boxShadow: '0 2px 4px rgba(0,0,0,0.1)' }}>
          <h2 style={{ fontSize: '1.5rem', marginBottom: '15px', color: '#333' }}>Quick Actions</h2>
          <div style={{ display: 'flex', gap: '15px', flexWrap: 'wrap' }}>
            <button style={{ padding: '10px 20px', backgroundColor: '#28a745', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer' }}>Add Income</button>
            <button style={{ padding: '10px 20px', backgroundColor: '#dc3545', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer' }}>Add Expense</button>
            <button style={{ padding: '10px 20px', backgroundColor: '#6c757d', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer' }}>View Reports</button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Home
