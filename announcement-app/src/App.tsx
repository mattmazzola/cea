import './App.css'

function App() {
  return (<>
    <header >
      <h1>Corporate E-sports Associate <br /> Announcement Generator</h1>
    </header>
    <section>
      <form className="inputs">
        <h2>Tournaments:</h2>
        <input type="text" placeholder="Starcraft 2 Corporate" defaultValue="Starcraft 2 Corporate" required />

        <h2>Team Name:</h2>
        <input type="text" placeholder="Macrohard Microsoft" required />

        <h2>User Auth Token:</h2>
        <input type="text" placeholder="eyJhbGci..." required />

        <div className="span">
          <button type="submit">Fetch Data</button>
        </div>
      </form>
    </section>
  </>
  )
}

export default App
