#!/usr/bin/env node

const aes = require('aes-cross')
const should = require('should')

const key = 'NNNNNNNNNNNNNNN'
const iv = 'STARTVEKTORNØKKEL'
const src = 'detsomskalkodes'

const key128iv = Buffer.from(iv)
const key256iv = Buffer.concat([key128iv, key128iv])

// aes-128-cbc
let enced = aes.enc(src, key, key128iv)
console.log('enced:', enced)
let deced = aes.dec(enced, key, key128iv)
console.log('deced:', deced)

let svar = 'n5JCFqUuq0cMBbeb8q4yLQ=='
console.log('Forventet:' + svar)
enced.should.equal(svar, 'Forventet CBC-128bit med IV ble levert, altså:' + svar)
