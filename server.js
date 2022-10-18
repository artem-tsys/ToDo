const jsonServer = require('json-server')
const server = jsonServer.create()
const router = jsonServer.router('db.json', {})
const middlewares = jsonServer.defaults({})
const {v4: uuidv4} = require('uuid');

// Set default middlewares (logger, static, cors and no-cache)
server.use(middlewares)

// // Add custom routes before JSON Server router
// server.get('/notes', (req, res) => {
//   res.jsonp(req.query)
// })

// To handle POST, PUT and PATCH you need to use a body-parser
// You can use the one used by JSON Server
server.use(jsonServer.bodyParser)
server.use((req, res, next) => {
  if (req.method === 'POST') {
    req.body.id = uuidv4()
  }
  // Continue to JSON Server router
  next()
})

// Use default router
server.use(router)
server.listen(3005, () => {
  console.log('JSON Server is running')
})
