import { Form } from "@remix-run/react"
import React from "react"

type Props = {
    tournaments: any[]
    defaultMapsUrl: string
    defaultBaseUrl: string
    defaultTeamName: string
    defaultMatchTime: string
}

const InputsForm: React.FC<Props> = (props) => {
    return (
        <Form className="inputs" method="post">
            <h2>Maps Url:</h2>
            <input type="text" name="inputMapsUrl" id="inputMapsUrl" defaultValue={props.defaultMapsUrl} required />

            <h2>Base API Url:</h2>
            <input type="text" name="inputBaseUrl" id="inputBaseUrl" placeholder="Starcraft 2 Corporate" defaultValue={props.defaultBaseUrl} required />

            <h2>Current SC2 <br />Tournaments:</h2>
            <select name="inputTournaments" id="inputTournaments" title="Tournaments" multiple required>
                {props.tournaments.map(tournament => {
                    return (
                        <option key={tournament.tmid} value={tournament.name} selected>{tournament.name}</option>
                    )
                })}
            </select>

            <h2>Team Name:</h2>
            <input type="text" name="inputTeamName" id="inputTeamName" placeholder={props.defaultTeamName} defaultValue={props.defaultTeamName} required />

            <h2>Match Time:</h2>
            <input type="text" name="inputMatchTime" id="inputMatchTime" placeholder={props.defaultMatchTime} defaultValue={props.defaultMatchTime} required />

            <h2>User Auth Token:</h2>
            <input type="text" name="inputUserAuthToken" id="inputUserAuthToken" placeholder="eyJhbGci..." required />

            <div className="span">
                <button type="submit">Fetch Match Data</button>
            </div>
        </Form>
    )
}

export function getFormData(formData: FormData) {
    const tournamentIdsOfInterest = formData.getAll('inputTournaments') as string[]
    const formDataEntries = Object.fromEntries(formData)
    const teamName = formDataEntries.inputTeamName as string
    const matchTime = formDataEntries.inputMatchTime as string
    const userAuthToken = formDataEntries.inputUserAuthToken as string
    const baseUrl = formDataEntries.inputBaseUrl as string

    return {
        baseUrl,
        tournamentIdsOfInterest,
        teamName,
        matchTime,
        userAuthToken,
    }
}

export default InputsForm