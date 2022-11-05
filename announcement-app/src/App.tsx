import { fetchMatchData } from '@mattmazzola/cea-announcement-generator'
import React from 'react'
import './App.css'
import { getPlainText } from './helpers'

function App() {
  const defaultBaseUrl = process.env.REACT_APP_BASE_URL!
  const defaultTeamName = process.env.REACT_APP_TEAM_NAME!
  const defaultMatchTime = process.env.REACT_APP_MATCH_TIME!
  const tournamentNameFilterKeywords = ['sc2', 'starcraft']

  const [tournaments, setTournaments] = React.useState<any[]>([])
  const [matchDatas, setMatchDatas] = React.useState<any[]>([])
  const [matchTime, setMatchTime] = React.useState<string>(defaultMatchTime)

  React.useEffect(() => {
    async function fetchTournaments() {
      const tsResponse = await fetch(`${defaultBaseUrl}/tournaments`)
      const tsJson = await tsResponse.json()
      const filteredTournaments: any[] = tsJson.data
          .filter((t: any) => t.current === true)
          .filter((t: any) => tournamentNameFilterKeywords
            .some(tWord => (t.name as string).toLowerCase().includes(tWord.toLowerCase())))

      setTournaments(filteredTournaments)
    }

    fetchTournaments()
  }, [defaultBaseUrl, tournamentNameFilterKeywords])


  const onSubmitFetchData: React.FormEventHandler<HTMLFormElement> = async (event) => {
    event.preventDefault()

    const tournamentsOfInterestElement = (document.getElementById("input-tournaments") as HTMLSelectElement)
    const tournamentsOfInterest = [...tournamentsOfInterestElement.options]
                     .filter(x => x.selected)
                     .map(x => x.text);
    const teamName = (document.getElementById("input-team-name") as HTMLInputElement).value
    const inputMatchTime = (document.getElementById("input-match-time") as HTMLInputElement).value
    setMatchTime(inputMatchTime)
    const userAuthToken = (document.getElementById("input-token") as HTMLInputElement).value

    console.log({
      defaultBaseUrl,
      tournamentsOfInterest,
      teamName,
      userAuthToken,
    })

    const matchDatas = await fetchMatchData(
      defaultBaseUrl,
      tournamentsOfInterest,
      teamName,
      userAuthToken,
    )

    setMatchDatas(matchDatas)
  }

  return (<>
    <header>
      <h1>Corporate E-sports Association <br /> Announcement Generator</h1>
    </header>
    <main>
      <section className="form">
        <form className="inputs" onSubmit={onSubmitFetchData}>
          <h2>Base Url:</h2>
          <input type="text" id="input-base-url" placeholder="Starcraft 2 Corporate" defaultValue={defaultBaseUrl} required />

          <h2>Tournaments:</h2>
          <select id="input-tournaments" title="Tournaments" multiple required>
            {tournaments.map(tournament => {
              return (
                <option key={tournament.tmid} value={tournament.tmid} selected>{tournament.name}</option>
              )
            })}
          </select>

          <h2>Team Name:</h2>
          <input type="text" id="input-team-name" placeholder={defaultTeamName} defaultValue={defaultTeamName} required />

          <h2>Match Time:</h2>
          <input type="text" id="input-match-time" placeholder={defaultMatchTime} defaultValue={defaultMatchTime} required />

          <h2>User Auth Token:</h2>
          <input type="text" id="input-token" placeholder="eyJhbGci..." required />

          <div className="span">
            <button type="submit">Fetch Data</button>
          </div>
        </form>
      </section>
      {matchDatas.map(matchData => {
        const matchDataPlainText = getPlainText(matchData, matchTime)

        return (
          <section>
            <h2>Match Data:</h2>
            <h3>Plain Text</h3>
            <textarea>{matchDataPlainText}</textarea>
          </section>
        )
      })}
    </main>
  </>
  )
}

export default App
