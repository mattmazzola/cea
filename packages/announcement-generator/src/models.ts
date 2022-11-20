export type MatchData = {
    tournamentName: string
    team1: TeamData
    team2: TeamData
    games: GameData[]
    weekName: string
}

export type TeamData = {
    name: string
    orgName: string
}

export type GameData = {
    team1Players: PlayerData[]
    team1Message: string
    team2Players: PlayerData[]
    team2Message: string
    map: MapWrapper
}

export type PlayerData = {
    name1: string
    name2: string
}

export type MapWrapper = {
    mapNumber: string
    matchType: string
    A: MapData
    B: MapData
}

export type MapData = {
    category: string
    name: string
    source: string
    type: string
    url: string
}