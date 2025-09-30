import React from 'react'

function Income() {
  return (
    <div style={{ minHeight: '100vh', padding: '20px', backgroundColor: '#f8f9fa' }}>
      <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
        <h1 style={{ fontSize: '2rem', fontWeight: 'bold', marginBottom: '20px', color: '#333' }}>Income Management</h1>
        <div style={{ backgroundColor: 'white', padding: '20px', borderRadius: '8px', boxShadow: '0 2px 4px rgba(0,0,0,0.1)' }}>
          <h2 style={{ fontSize: '1.5rem', marginBottom: '15px', color: '#555' }}>Add New Income</h2>
          <p style={{ color: '#666', marginBottom: '20px' }}>Track your income sources and amounts here.</p>
          <div style={{ display: 'grid', gap: '15px', maxWidth: '400px' }}>
            <div>
              <label style={{ display: 'block', marginBottom: '5px', fontWeight: '500' }}>Source:</label>
              <input type="text" placeholder="e.g., Salary, Freelance" style={{ width: '100%', padding: '8px', border: '1px solid #ddd', borderRadius: '4px' }} />
            </div>
            <div>
              <label style={{ display: 'block', marginBottom: '5px', fontWeight: '500' }}>Amount:</label>
              <input type="number" placeholder="0.00" style={{ width: '100%', padding: '8px', border: '1px solid #ddd', borderRadius: '4px' }} />
            </div>
            <button style={{ padding: '10px 20px', backgroundColor: '#28a745', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer' }}>Add Income</button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Income