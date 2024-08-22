#!/usr/bin/env node
// HUSK https://enterprisecraftsmanship.com/posts/dry-damp-unit-tests/

const helpers = require('./helpers.js')
const urlRoot = 'https://data.brreg.no/enhetsregisteret/api'

// Env håndtering
const envPageSize = (process.env.PAGESIZE? process.env.PAGESIZE : 20)

// Håndtere kommandolinje argumenter
const args = process.argv.slice(2) // Første argument er node, andre er script. Fra tredje får vi posisjonelle argumenter fra kommandolinje
if (args.length<1) throw new Error(`Vennligst angi hvilket navn eller organisasjonsnummer du vil søke etter`)
// VALGFRITT NÅ: if (args.length<2) throw new Error(`Vennligst angi hvilken fil du vil lagre hentet data til f.eks svar.json`)

const letEtterNavnEllerNummer = args[0].trim()
const lagrefil = (args[1]? args[1] : false)

console.log(`Starter søke skript: Søker etter:"${letEtterNavnEllerNummer}" og lagrer til fil:"${lagrefil}". envPageSize: ${envPageSize}`)
// Hjelpe funksjoner som kan gjøres til domene-klasse-hjelper om de skal gjenbrukes i flere skript
async function hentJsonDokument(enhetstype) {
  const url = `${urlRoot}/${enhetstype}?size=${parseInt(envPageSize)}`
  return helpers.GET(url, false)
}
// TODO: Legg til støtte for å hente alle enheter serielt eller parallelt?
async function hentDokument(enhetstype) {
  helpers.log.INFO(`Henter "${enhetstype}"`)
  const jsonStringData = await hentJsonDokument(enhetstype)
  const jsonData = JSON.parse(jsonStringData)
  const antallFunnet = jsonData['_embedded'][enhetstype].length
  const antallTotal = ( (jsonData.page && jsonData.page.totalElements) ? jsonData.page.totalElements : antallFunnet)
  helpers.log.INFO(`Hentet "${enhetstype}", fant antall: ${antallFunnet} av totalt: ${antallTotal}`)
  return jsonData['_embedded'][enhetstype]
}

(async () => {
  // Henter dataene
  const enheter = await hentDokument('enheter')
  const underEnheter = await hentDokument('underenheter')
  const orgformer = await hentDokument('organisasjonsformer')

  // Søker i dataene - enheter
  let antallTreff = 0
  const fantEnheter = enheter.filter( (enhet) => {
    return (enhet.navn.includes(letEtterNavnEllerNummer) || enhet.organisasjonsnummer.includes(letEtterNavnEllerNummer))
  })
  helpers.log.INFO(`Fant treff i enheter:`)
  helpers.log.prettyOutput(fantEnheter)
  antallTreff += fantEnheter.length

  // Søker i dataene - underenheter
  underEnheter.forEach( (enhet) => {
    if (enhet.navn.includes(letEtterNavnEllerNummer) || enhet.organisasjonsnummer.includes(letEtterNavnEllerNummer)) {
      helpers.log.INFO(`Fant treff i underenheter:`)
      helpers.log.prettyOutput(enhet)
      antallTreff++
    }
    // TODO: Søke etter andre felt f.eks kommune?
  })

  // TODO: Lagre resultater til fil:
  helpers.log.INFO(`Antall søketreff på "${letEtterNavnEllerNummer}" - ${antallTreff}`)
  console.log(`Skript ferdig kjørt`)
})()

console.log(`Skript ferdig parset`)



