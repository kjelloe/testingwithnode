#!/usr/bin/env node
// HUSK chmod +x hent.js

const url = 'https://data.brreg.no/enhetsregisteret/api'

async function asynkronStartFunksjon() {
  const response = await fetch(url)
  console.log('HTTP status:', response.status)
  const bodyJson = await response.json()
  console.log('JSON svar:', bodyJson)
}

// Og så utfører vi async-kallet ***
asynkronStartFunksjon()

/* MERK *** Async start/main kall pleier å være skrevet slik:
(async () => {
  const response = await fetch(url)
  INFO('HTTP status:', response.status)
  const bodyJson = await response.json()
  INFO('JSON svar:', bodyJson)
})()
  
*/