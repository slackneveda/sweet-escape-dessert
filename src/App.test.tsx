function SimpleApp() {
  return (
    <div style={{ padding: '20px', fontSize: '18px' }}>
      <h1>Simple Test App</h1>
      <p>If you can see this, React is working!</p>
      <div style={{ color: 'red', marginTop: '10px' }}>
        Current time: {new Date().toLocaleTimeString()}
      </div>
    </div>
  )
}

export default SimpleApp
