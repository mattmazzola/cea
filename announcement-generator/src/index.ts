import Crawler from 'crawler'
import dotenv from 'dotenv-flow'
import invariant from 'invariant'

dotenv.config()

const playerPage = 'https://app.playcea.com/player'
const upcomingCollegiateMatches = 'https://app.playcea.com/games/sc2/hlzpo9Gfss/upcoming'
const teamName = process.env.TEAM_NAME
invariant(typeof teamName === 'string', `Env TEAM_NAME must be string`)

const crawler = new Crawler({})

crawler.queue({
    uri: upcomingCollegiateMatches,
    callback(error, result, done) {
        if (error) {
            console.log(error)
        } else {
            var $ = result.$
            console.log($('title').text())
        }
        done()
    },
})

crawler.queue({
    uri: playerPage,
    callback(error, result, done) {
        if (error) {
            console.log(error)
        } else {
            var $ = result.$
            console.log($('title').text())
        }
        done()
    },
})