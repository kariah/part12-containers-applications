const redis = require('redis')
const { promisify } = require('util')
const { REDIS_URL } = require('../util/config') 

let getAsync
let setAsync
 

if (!REDIS_URL) {
  const redisIsDisabled = () => {
    console.log('No REDIS_URL set, Redis is disabled')
    return null
  }
  getAsync = redisIsDisabled
  setAsync = redisIsDisabled
} else { 
  
  //let visits = 0

  const client = redis.createClient({
    url: REDIS_URL 
  })
 
  // visits ++

  //console.log('visits ', visits)

  getAsync = promisify(client.get).bind(client)
  setAsync = promisify(client.set).bind(client)    
 
  // getAsync(visits)
  //   console.log("function is test a ", visits)

  //   setAsync("visits", visits)
  //   console.log("function is test b ", visits)

}

module.exports = {
  getAsync,
  setAsync
}



// let visits = 0


// /* GET index data. */
// router.get('/', async (req, res) => {
//   visits++

//   res.send({
//     ...configs,
//     visits
//   });
// });
