import { MatchData } from "@mattmazzola/cea-announcement-generator"

export function getPlainText(
    matchData: MatchData,
    timeString: string,
    teamName: string,
): string {
    let opponentTeam = matchData.team1
    if (opponentTeam.name.toLowerCase() === teamName.toLowerCase()) {
        opponentTeam = matchData.team2
    }

    let s = ``

    s += `${matchData.tournamentName} - ${matchData.weekName} - ${timeString} - ${opponentTeam.name} (${opponentTeam.orgName})\n`
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