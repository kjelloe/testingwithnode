#!/usr/bin/env node
// HUSK https://enterprisecraftsmanship.com/posts/dry-damp-unit-tests/

const helpers = require('./helpers.js')
const url = 'https://data.brreg.no/enhetsregisteret/api'
const lagrefil = 'hentet.json'

helpers.GET(url, lagrefil)
console.log('Ferdig - hentet til ' + lagrefil)



