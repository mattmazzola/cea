import { fetchMatchData } from "@mattmazzola/cea-announcement-generator"
import { MatchData } from "@mattmazzola/cea-announcement-generator/build/models"
import { ActionFunction, json, LinksFunction, LoaderFunction, MetaFunction } from "@remix-run/node"
import {
  Links,
  LiveReload,
  Meta,
  Outlet,
  Scripts,
  ScrollRestoration,
  useActionData,
  useLoaderData,
  useTransition
} from "@remix-run/react"
import indexStyles from '~/styles/index.css'
import rootStyles from '~/styles/root.css'
import InputsForm, { getFormData } from "./components/InputsForm"
import { getPlainText } from "./helpers"

export const meta: MetaFunction = () => ({
  charset: "utf-8",
  title: "CEA - SC2 Announcement Generator",
  viewport: "width=device-width,initial-scale=1",
})

export const links: LinksFunction = () => [
  { rel: "stylesheet", href: rootStyles },
  { rel: "stylesheet", href: indexStyles },
]

type LoaderData = {
  tournaments: any[]
  ENV: Record<string, string>
}

export const loader: LoaderFunction = async () => {
  const mapsUrl = `${process.env.MAPS_URL}`
  const mapsResponse = await fetch(mapsUrl)
  const mapsJson = await mapsResponse.json()
  const maps = mapsJson.data

  const tournamentsUrl = `${process.env.BASE_URL}/tournaments`
  const tournamentsResponse = await fetch(tournamentsUrl)
  const tournamentsJson = await tournamentsResponse.json()
  const tournamentNameFilterKeywords = ['SC2', 'starcraft']
  const tournaments = (tournamentsJson.data as any[])
    .filter(t => t.current === true)
    .filter(t => tournamentNameFilterKeywords
      .some(tFilterWord => t.name.toLowerCase().includes(tFilterWord.toLowerCase())))

  return json({
    tournaments,
    maps,
    ENV: {
      MAPS_URL: process.env.MAPS_URL,
      BASE_URL: process.env.BASE_URL,
      TEAM_NAME: process.env.TEAM_NAME,
      MATCH_TIME: process.env.MATCH_TIME,
    },
  })
}

type ActionData = {
  matchDatas: MatchData[]
  matchTime: string
  teamName: string
}

export const action: ActionFunction = async ({ request }) => {
  const rawFormData = await request.formData()
  const inputData = getFormData(rawFormData)
  console.log({
    ...inputData,
  })

  const {
    baseUrl,
    tournamentIdsOfInterest,
    teamName,
    matchTime,
    userAuthToken,
  } = inputData

  const matchDatas = await fetchMatchData(
    baseUrl,
    tournamentIdsOfInterest,
    teamName,
    userAuthToken,
  )

  return {
    matchDatas,
    matchTime,
    teamName,
  }
}

export default function App() {
  const { tournaments, ENV } = useLoaderData<LoaderData>()
  const actionData = useActionData<ActionData>()
  const transition = useTransition()
  const defaultMapsUrl = ENV.MAPS_URL
  const defaultBaseUrl = ENV.BASE_URL
  const defaultTeamName = ENV.TEAM_NAME
  const defaultMatchTime = ENV.MATCH_TIME

  return (
    <html lang="en">
      <head>
        <Meta />
        <Links />
      </head>
      <body>
        <header>
          <h1>CEA SC2 Announcement Generator</h1>
        </header>
        <main>
          <section className="center">
            <InputsForm
              tournaments={tournaments}
              defaultMapsUrl={defaultMapsUrl}
              defaultBaseUrl={defaultBaseUrl}
              defaultTeamName={defaultTeamName}
              defaultMatchTime={defaultMatchTime}
            />
          </section>
          <h1>Match Data:</h1>
          {transition.state != "idle"
            ? <h2>Loading...</h2>
            : ((Array.isArray(actionData?.matchDatas) && actionData!.matchDatas.length) > 0)
              ? actionData?.matchDatas.map((matchData, matchDataIndex) => {
                const matchDataPlainText = getPlainText(
                  matchData,
                  actionData?.matchTime,
                  actionData?.teamName,
                )

                return (
                  <section key={matchDataIndex} className="center">
                    <textarea className="matchDataText" readOnly={true} value={matchDataPlainText} />
                  </section>
                )
              })
              : <h2>No matches found</h2>}
          <Outlet />
        </main>
        <ScrollRestoration />
        <Scripts />
        <script
          dangerouslySetInnerHTML={{
            __html: `window.ENV = ${JSON.stringify(ENV)}`,
          }}
        />
        <LiveReload />
      </body>
    </html>
  )
}
