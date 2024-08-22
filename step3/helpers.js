const httpsklient = require('https')
const fs = require('fs')

// Define helper - utils function
const helpers = {

 GET : function(urlvivilhente, filnavnforlagring) {
  httpsklient.get(urlvivilhente, res => {
    let data = ''
    console.log('Http status kode: ', res.statusCode)
  
    res.on('data', datachunk => {
      data += datachunk
      fs.appendFileSync(filnavnforlagring, datachunk)
    })
  
    res.on('end', () => {
      console.log('slutt på data, mottok:')
      console.log(JSON.parse(data))
    })
  }).on('error', err => {
    console.log('Det skjedde en feil', err )
  })
 }

}
module.exports = helpers

