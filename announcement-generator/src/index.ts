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

    console.log(`${firstMatch.tournamentName} - ${firstMatch.weekName} - Saturday 11am PDT (UTC-7) - ${firstMatch.team2.name} (${firstMatch.team2.orgName})`)
    console.log(``)

    const longestMapName = firstMatch.games.reduce((maxLength, game) => Math.max(maxLength, game.map.A.name.length), 0)

    for (const [gameIndex, game] of firstMatch.games.entries()) {
        let gameLogMessage = `${game.map.mapNumber} (${game.map.matchType})\t- ${game.map.A.name.padEnd(longestMapName, ' ')} (${game.map.A.source})`
        if (gameIndex < firstMatch.games.length - 1) {
            gameLogMessage += `\t- ${game.team1Players.map(user => `${user.name1}`).join(', ')} vs. ${game.team2Players.map(user => `${user.name1}`).join(', ')}`
        }

        console.log(gameLogMessage)
    }
}

main()
