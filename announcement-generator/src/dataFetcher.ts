import { GameData, MatchData, PlayerData } from "./models"

export {
    MatchData,
}

const getMapsUrl = () => `https://cea-assets.s3.amazonaws.com/sc2/map-lineups/corporate.json`
const getTournamentsUrl = (baseUrl: string) => `${baseUrl}/tournaments`
const getUpcomingMatchesUrl = (baseUrl: string, tournamentId: string) => `${baseUrl}/tournaments/${tournamentId}/upcoming`
const getMatchUrl = (baseUrl: string, matchId: string) => `${baseUrl}/matches/${matchId}`
const getUserUrl = (baseUrl: string, userId: string) => `${baseUrl}/users/${userId}`

export async function fetchMatchData(
    baseUrl: string,
    tournamentNamesOfInterest: string[],
    teamName: string,
    bearerToken: string,
): Promise<MatchData[]> {
    const tournamentsResponse = await fetch(getTournamentsUrl(baseUrl))
    const tournamentsJson = await tournamentsResponse.json()
    const tournamentsOfInterest = tournamentsJson.data
        .filter(t => t.current === true)
        .filter(t => tournamentNamesOfInterest.some(tId => t.name.toLowerCase() === tId.toLocaleLowerCase()))
    const matchDatas: MatchData[] = []

    const mapDataResponse = await fetch(getMapsUrl())
    const mapJson = await mapDataResponse.json()
    const targetWeek = mapJson.weeks.at(0)

    for (const tournament of tournamentsOfInterest) {
        const upcomingMatchesResponse = await fetch(getUpcomingMatchesUrl(baseUrl, tournament.tmid))
        const upcomingMatchesJson = await upcomingMatchesResponse.json()
        const upcomingMatchesForTeam = upcomingMatchesJson.data
            .filter(match => match.ts
                .some(t => t.dn.toLowerCase() === teamName.toLowerCase()))

        for (const upcomingMatch of upcomingMatchesForTeam) {
            const team0 = upcomingMatch.ts.at(0)
            const team1 = upcomingMatch.ts.at(1)

            const headers = {}
            if (typeof bearerToken === 'string') {
                headers['Authorization'] = `Bearer ${bearerToken}`
            }

            const upcomingMatchResponse = await fetch(getMatchUrl(baseUrl, upcomingMatch.mid), {
                headers
            })
            const upcomingMatchJson = await upcomingMatchResponse.json()
            const allUserIds = upcomingMatchJson.data.gs.flatMap(g => g.ts).flatMap(t => t.uids.map(x => x.uid))
            const matchUserIds = new Set<string>(allUserIds)
            const userJsons = await Promise.all([...matchUserIds].map(userId => fetch(getUserUrl(baseUrl, userId)).then(r => r.json())))
            const users = userJsons.map(userJson => userJson.data)
            const idToUserDict = Object.fromEntries(users.map(u => [u.uid, { name: u.dn, nameId: u.ddn }]))

            const matchData: MatchData = {
                tournamentName: tournament.name,
                weekName: targetWeek.weekName,
                team1: {
                    name: team0.dn,
                    orgName: team0.org,
                },
                team2: {
                    name: team1.dn,
                    orgName: team1.org,
                },
                games: []
            }

            for (const [gameIndex, game] of upcomingMatchJson.data.gs.entries()) {
                const gameMap = targetWeek.maps.at(gameIndex)

                const gameData: GameData = {
                    team1Players: [],
                    team1Message: '',
                    team2Players: [],
                    team2Message: '',
                    map: gameMap,
                }

                for (const [gameTeamIndex, gameTeam] of game.ts.entries()) {
                    const teamMessage = gameTeam.msg ?? ''
                    const teamUserIds = gameTeam.uids.flatMap(x => x.uid)
                    const users = teamUserIds.map(uid => idToUserDict[uid])

                    let targetArray: PlayerData[]
                    if (gameTeamIndex === 0) {
                        targetArray = gameData.team1Players
                        gameData.team1Message = teamMessage
                    }
                    else if (gameTeamIndex === 1) {
                        targetArray = gameData.team2Players
                        gameData.team2Message = teamMessage
                    }
                    else {
                        throw Error(`Team index was out of bounds. Only expected index 0 or 1 but got ${gameTeamIndex}`)
                    }

                    const playerDatas = (users as any[]).map<PlayerData>(user => {
                        return {
                            name1: user.name,
                            name2: user.nameId,
                        }
                    })

                    targetArray.push(...playerDatas)
                }

                matchData.games.push(gameData)
            }

            matchDatas.push(matchData)
        }
    }

    return matchDatas
}