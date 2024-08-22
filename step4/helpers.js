const httpsklient = require('https')
const fs = require('fs')
const superagent = require('superagent')

// Define helper - utils function
const helpers = {

 GET : function(urlvivilhente, filnavnforlagring) {
    return superagent
      .get( urlvivilhente )
      .set( { 'Content-Type' : 'application/json' } )
      .send()
      .end( (err, res) => {
        // res.body is json parsed, res.text is non-parased
         helpers.skrivfiltildisk(filnavnforlagring, res.text)
         return res.body
       })
  },
  skrivfiltildisk: function(filnavn, innhold) {
    fs.writeFileSync(filnavn, innhold)
  }
}

module.exports = helpers

