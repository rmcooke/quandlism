express   = require 'express'
http      = require 'http'
routes    = require './routes/'
data      = require './routes/data'
settings  = require './settings' 

app = express()

app.configure ->
  app.set "port", settings.port || 3000
  app.set "views", "#{__dirname}/views"
  app.set "view engine", 'jade'
  app.use express.logger('dev')


app.configure 'development', ->
  app.use express.errorHandler()
  
console.log data
# Routes
app.get "/", routes.index
app.get "/data/chart", data.chart

http.createServer(app).listen app.get('port'), ->
  console.log "Listening on port #{app.get('port')}"

