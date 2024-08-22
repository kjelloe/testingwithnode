const httpsklient = require('https')
const fs = require('fs')
const superagent = require('superagent')

// Define helper - utils function
const helpers = {

 GET : async function(urlvivilhente, filnavnforlagring) {
  return new Promise((resolve, reject) => {
    superagent
      .get( urlvivilhente )
      .set( { 'Content-Type' : 'application/json', 'Accept' : 'application/json'} )
      .send()
      .then( response => {
        if (response.statusCode != 200) { reject('Invalid status code:' + response.statusCode) }
        if (filnavnforlagring!==false) helpers.skrivfiltildisk(filnavnforlagring, response.text)
        resolve(response.text)
       })
      .catch( error => {
        if(error.code=='SELF_SIGNED_CERT_IN_CHAIN') {
          console.warn(`WARNING: auth cannot run due due to missing certs, please run the following command: export NODE_EXTRA_CA_CERTS=...`)
        }
        console.error('Authorize request failed: ', (error.response.error? error.response.error : error))
        reject(error)
      })     
    })
  },
  skrivfiltildisk: function(filnavn, innhold) {
    fs.writeFileSync(filnavn, innhold)
  },
  log : {
     logWithDateAndType: function(message, type, obj) {
      console.log(new Date().toISOString() + ': ' + (type!==undefined? '['+type+'] ' : '') + JSON.stringify(message).replace(/\\"/g,'"'), (obj!==undefined? obj : ''))
    },
    INFO: function(message, someObjectToLog) {
      helpers.log.logWithDateAndType(message, 'INFO', someObjectToLog)
    },
    prettyOutput : function(someObject, objectType='json') {
      if (objectType=='map') {
        keys = [ ...someObject.keys() ]
        return `[ ${keys} ]`
      }
      // Default to json
      console.log(JSON.stringify(someObject, null, 2))
    }
  }
}

module.exports = helpers

