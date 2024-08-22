#!/usr/bin/env node

const should = require('should')
const process = require('process')
const helpers = require('../helpers.js')

// Env håndtering
const envStinkTokenPath = (process.env.STOKENPATH? process.env.STOKENPATH : helpers.file.findFileUpwardsFromCurrentDirectory('.stinktoken.txt')) // Må fornyes hver 24. timer
// SToken håndtering
if (!helpers.isValidAccessToken(envStinkTokenPath, 24)) throw new Error(`SToken hentet fra fil "${envStinkTokenPath}" har gått ut og må fornyes. Normalt etter 24 timer.`)

// Håndtere kommandolinje argumenter
const args = process.argv.slice(2) // Første argument er node, andre er script. Fra tredje får vi posisjonelle argumenter fra kommandolinje
if (args.length<1) throw new Error(`Vennligst angi json fil som skal leses inn f.eks input.json`)

const jsonInput = helpers.file.readFileAsJson(args[0])

/* Eksempel json
...
{
  "brukerId": "m99600",
  "identifikatorverdi": "04615797036",
  "organisasjonsenhet": "IT",
  "leder": "m99500",
  "postnummer": "6600",
  "poststed": "Sunndalsøra",
  "adresse": "Sunndalsøra"
}
...s

*/

// TODO: Make into file input? Reuse templating tools?
const sqlTemplate = "INSERT INTO HABILITETSREGISTEMUKGFBJVBROYW.EMPLOYEE(USER_ID, MANAGER_ID, NATIONAL_IDENTITY) VALUES('${brukerId}','${leder}','${identifikatorverdi}');"
const tokenMap = helpers.tokens.findAllTokensAsMap(sqlTemplate) // BUG: Gir bare en entry?

function dummy() {} // Placeholder

// Kjøre spesifikk metoder - pakket i async for å tillate bruk av await
(async () => {
  helpers.log.info('START: Test definert og kjøring starter')

  helpers.log.info('Fant følgende tokens i angitt SQL string: ', tokenMap.size)
  // TODO: Support multilevel path merging
  Object.values(jsonInput).forEach( (entry => {
    const replacementMap = new Map()
    // Replace with paraparased sed data
    replacementMap.set('brukerId', entry.brukerId)
    replacementMap.set('leder', entry.leder)
    replacementMap.set('identifikatorverdi', entry.identifikatorverdi)
    const output = helpers.tokens.replaceAll(sqlTemplate, replacementMap)
    console.log(output)
  }))

  helpers.log.info('SLUTT: Test ferdig kjørt')
})()


