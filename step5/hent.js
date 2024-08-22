#!/usr/bin/env node
// HUSK https://enterprisecraftsmanship.com/posts/dry-damp-unit-tests/

const helpers = require('./helpers.js')
const urlRoot = 'https://data.brreg.no/enhetsregisteret/api'

// Env håndtering
const envToken = (process.env.TOKEN? process.env.TOKEN : 'some_Default_token_or throw ERror')

// Håndtere kommandolinje argumenter
const args = process.argv.slice(2) // Første argument er node, andre er script. Fra tredje får vi posisjonelle argumenter fra kommandolinje
if (args.length<1) throw new Error(`Vennligst angi hvilket register du vil hente data fra f.eks enheter, underenheter eller organisasjonsformer`)
if (args.length<2) throw new Error(`Vennligst angi hvilken fil du vil lagre hentet data til f.eks hentet.json`)

const enhetsType = args[0]
const lagrefil = args[1]

console.log(`Starter hentet skript: Henter enhetstype:"${enhetsType}" og lagrer til fil:"${lagrefil}". envToken: ${envToken}`)

const url = `${urlRoot}/${enhetsType}`
helpers.GET(url, lagrefil)
console.log(`Ferdig - hentet fil ${lagrefil}`)



