#!/usr/bin/env node

const { Pool, Client } = require('pg') // DOCS: https://node-postgres.com/features/connecting
const fs = require('fs')
const process = require('process')

// Håndtere kommandolinje argumenter
const args = process.argv.slice(2) // Første argument er node, andre er script. Fra tredje får vi posisjonelle argumenter fra kommandolinje
if (args.length<2) throw new Error(`Vennlist angi: fil med openshift db properties og spørring f.eks konkurs-bh-db-1.properties 'SELECT navn, modus, siste_leste_registrerings_tidspunkt, tidspunkt_endret FROM public.tilstand;'`)

const configFilePath = args[0]
const stringQueryOrPath = args[1]
let stringQuery = stringQueryOrPath

if (fs.existsSync(configFilePath)===false) throw new Error(`Fant ikke angitt konfigurasjonsfil: ${configFilePath}`)
if (stringQueryOrPath===undefined || stringQueryOrPath.trim().length==0) throw new Error(`Fant ingen SQL query angitt hverken fil eller tekst streng`)
if (fs.existsSync(stringQueryOrPath)) {
  console.log(`Fant filen "${stringQueryOrPath}" og leser spørring fra den...`)
  stringQuery = fs.readFileSync(stringQueryOrPath, 'utf-8').toString()
}

/* Eksempel på properties fil:
#
#Mon Mar 20 11:30:44 CET 2023
jdbc.password=a1o4aGNpZI0zP8Vl6BLDwWzdL7QIPV
jdbc.user=ezjwyauzhcusudtenqdioipkeumtul
jdbc.url=jdbc\:postgresql\://uil0part-drivein-pgsql01.db.skead.no\:5432/ezjwyauzhcusudtenqdioipkeumtul
*/
function loadOpenshiftPropertiesAsJson(filepath) {
  const lines = fs.readFileSync(filepath, 'utf-8').toString().split(/\r?\n/)
  let configObject = { 'jdbc': {} }
  lines.forEach( (line) => {
    if (line.trim().startsWith('jdbc')) {
      const [ key, val ] = line.trim().substring('jdbc.'.length).split('=',2)
      configObject['jdbc'][key] = val.replace(/\\:/g, ':')
    }
  })
  return configObject
}

function formatJsonOutput(jsonObject) {
  return JSON.stringify(jsonObject, null, 2)
}

const configFileProperties = loadOpenshiftPropertiesAsJson(configFilePath)
// jdbc:postgresql://uil0part-drivein-pgsql01.db.skead.no:5432/raafwnekuuiojpjqlnhpsojqmugioh
const databaseHost = configFileProperties.jdbc.url.substring(configFileProperties.jdbc.url.indexOf('sql:')+6)
const connectionString = `postgresql://${configFileProperties.jdbc.user}:${configFileProperties.jdbc.password}@${databaseHost}`

const client = new Client({
  connectionString,
})

client.connect()

console.log(`SQL spørring mot dbhost "${databaseHost}" kjører: "${stringQuery}"`)

client.query(stringQuery, (err, res) => {
  if (err) console.error(err)
  else {
   const sqlResponseSubset = { columns : res.fields, rows: res.rows, rowCount: res.rowCount }
    console.log('SQL response:', formatJsonOutput(sqlResponseSubset))
  }
  client.end()
  console.log('END')
})
