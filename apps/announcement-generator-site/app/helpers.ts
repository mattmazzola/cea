import { MatchData } from "@mattmazzola/cea-announcement-generator"

export function getPlainText(
    matchData: MatchData,
    timeString: string,
): string {
    let s = ``

    s += `${matchData.tournamentName} - ${matchData.weekName} - ${timeString} - ${matchData.team2.name} (${matchData.team2.orgName})\n`
    s += `\n`

    for (const game of matchData.games) {
        let gameLogMessage = `${game.map.mapNumber} (${game.map.matchType}) - ${game.map.A.name} (${game.map.A.source})`
        const isAce = /ace/i.test(game.map.mapNumber)
        if (!isAce) {
            gameLogMessage += ` - ${game.team1Players.map(user => `${user.name1}`).join(', ')} vs. ${game.team2Players.map(user => `${user.name1}`).join(', ')}`
        }

        s += `${gameLogMessage}\n`
    }

    return s
}