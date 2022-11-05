import { MatchData } from "@mattmazzola/cea-announcement-generator/build/models"

export function getPlainText(
    matchData: MatchData,
    timeString: string,
): string {
    let s = ``

    s += `${matchData.tournamentName} - ${matchData.weekName} - ${timeString} - ${matchData.team2.name} (${matchData.team2.orgName})\n`
    s += `\n`

    const longestMapName = matchData.games.reduce((maxLength, game) => Math.max(maxLength, game.map.A.name.length), 0)

    for (const [gameIndex, game] of matchData.games.entries()) {
        let gameLogMessage = `${game.map.mapNumber} (${game.map.matchType})\t- ${game.map.A.name.padEnd(longestMapName, ' ')} (${game.map.A.source})`
        if (gameIndex < matchData.games.length - 1) {
            gameLogMessage += `\t- ${game.team1Players.map(user => `${user.name1}`).join(', ')} vs. ${game.team2Players.map(user => `${user.name1}`).join(', ')}`
        }

        s += `${gameLogMessage}\n`
    }

    return s
}