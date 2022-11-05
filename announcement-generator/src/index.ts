import dotenv from 'dotenv-flow'
import invariant from 'invariant'
import { fetchMatchData } from './dataFetcher'

dotenv.config()

const teamName = process.env.TEAM_NAME!
invariant(typeof teamName === 'string', `Env TEAM_NAME must be string`)

const bearerToken = process.env.BEARER_TOKEN!
invariant(typeof bearerToken === 'string', `Env BEARER_TOKEN must be string`)

const baseUrl = 'https://1ebv8yx4pa.execute-api.us-east-1.amazonaws.com/prod'
const tournamentNamesOfInterest = ['SC2 Fall 2022 Fun Season', 'Starcraft 2 Corporate']

async function main() {
    console.log(`Fetching match data...`)
    const matchDatas = await fetchMatchData(
        baseUrl,
        tournamentNamesOfInterest,
        teamName,
        bearerToken,
    )

    if (matchDatas.length > 1) {
        console.warn(`There is more than 1 match upcoming. This should not be possible.`)
    }

    const firstMatch = matchDatas.at(0)!

    console.log(`${firstMatch.tournamentName} - ${firstMatch.weekName}`)
    console.log(`Team 1: ${firstMatch.team1.name} (${firstMatch.team1.orgName})`)
    console.log(`Team 2: ${firstMatch.team2.name} (${firstMatch.team2.orgName})`)
    console.log(``)

    for (const [gameIndex, game] of firstMatch.games.entries()) {
        let gameLogMessage = `${game.map.mapNumber} (${game.map.matchType})\t- ${game.map.A.name} (${game.map.A.source})`
        if (gameIndex < firstMatch.games.length - 1) {
            gameLogMessage += `\t- ${game.team1Players.map(user => `${user.name1}`).join(', ')} VS. ${game.team2Players.map(user => `${user.name1}`).join(', ')}`
        }

        console.log(gameLogMessage)
    }
}

main()
