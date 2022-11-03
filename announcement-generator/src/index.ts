import dotenv from 'dotenv-flow'
import invariant from 'invariant'

dotenv.config()

// https://1ebv8yx4pa.execute-api.us-east-1.amazonaws.com/prod/tournaments/hlzpo9Gfss/upcoming
// https://1ebv8yx4pa.execute-api.us-east-1.amazonaws.com/prod/matches/LjrZ5Qy4hX  

const teamName = process.env.TEAM_NAME!
invariant(typeof teamName === 'string', `Env TEAM_NAME must be string`)
const baseUrl = 'https://1ebv8yx4pa.execute-api.us-east-1.amazonaws.com/prod'

const tournamentNamesOfInterest = ['SC2 Fall 2022 Fun Season', 'Starcraft 2 Corporate']
const tournamentsUrl = `${baseUrl}/tournaments`
const getUpcomingMatchesUrl = (tournamentId: string) => `${baseUrl}/tournaments/${tournamentId}/upcoming`
const getMatchUrl = (matchId: string) => `${baseUrl}/matches/${matchId}`

console.log({ teamName })

async function main() {
    console.log(`Fetching tournaments...`)
    const tournamentsResponse = await fetch(tournamentsUrl)
    const tournamentsJson = await tournamentsResponse.json()
    const tournamentsOfInterest = tournamentsJson.data.filter(t => tournamentNamesOfInterest.some(tn => t.name.toLowerCase() === tn.toLocaleLowerCase()))

    for (const tournament of tournamentsOfInterest) {
        const upcomingMatchesResponse = await fetch(getUpcomingMatchesUrl(tournament.tmid))
        const upcomingMatchesJson = await upcomingMatchesResponse.json()
        const upcomingMatchesForTeam = upcomingMatchesJson.data
            .filter(match => match.ts
                .some(t => t.dn.toLowerCase() === teamName.toLowerCase()))

        console.log(`Upcoming ${upcomingMatchesForTeam.lenght} matches for: ${teamName} in tournament: ${tournament.name}`)

        for (const upcomingMatch of upcomingMatchesForTeam) {
            const team0 = upcomingMatch.ts.at(0)
            const team1 = upcomingMatch.ts.at(1)

            console.log(`Team 1: ${team0.dn} (${team0.org}) Team 2: ${team1.dn} (${team1.org})`)

            const upcomingMatchResponse = await fetch(getMatchUrl(upcomingMatch.mid))
            const upcomingMatchJson = await upcomingMatchResponse.json()

            console.log({ upcomingMatchJson })
        }
    }
}

main()
