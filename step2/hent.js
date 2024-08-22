#!/usr/bin/env node
// HUSK chmod +x hent.js

const httpsklient = require('https')
const fs = require('fs')
const url = 'https://data.brreg.no/enhetsregisteret/api'
const lagrefil = 'hentet.json'

// Definere funksjoner
function GET (urlvivilhente, lagringssted) {
  fs.writeFileSync(lagrefil, '')
  httpsklient.get(urlvivilhente, res => {
    let data = ''
    console.log('Http status kode: ', res.statusCode)

    res.on('data', datachunk => {
      data += datachunk
      fs.appendFileSync(lagringssted, datachunk)
    })

    res.on('end', () => {
      console.log('slutt på data, mottok:')
      console.log(JSON.parse(data))
    })
  }).on('error', err => {
    console.log('Det skjedde en feil', err )
  })
}

// Bruke funksjoner
GET(url, lagrefil)