#!/usr/bin/env node
// HUSK chmod +x hent.js

const httpsklient = require('https')
const fs = require('fs')
const url = 'https://data.brreg.no/enhetsregisteret/api'
const lagrefil = 'hentet.json'

httpsklient.get(url, res => {
  let data = ''
  console.log('Http status kode: ', res.statusCode)

  res.on('data', datachunk => {
    data += datachunk
    fs.appendFileSync(lagrefil, datachunk)
  })

  res.on('end', () => {
    console.log('slutt på data, mottok:')
    console.log(JSON.parse(data))
  })
}).on('error', err => {
  console.log('Det skjedde en feil', err )
})
