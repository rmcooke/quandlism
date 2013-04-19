express   = require 'express'
http      = require 'http'
routes    = require './routes'
data      = require './routes/data'
settings  = require './settings' 
path      = require 'path'
app = express()

app.configure ->
  app.set "port", settings.port || 3000
  app.set "views", "#{__dirname}/views"
  app.set "view engine", 'jade'
  app.use express.logger('dev')
  app.use express.static("#{__dirname}/public")

app.configure 'development', ->
  app.use express.errorHandler()
  
# Routes
app.get "/", routes.index
app.get "/data/chart", data.chart
app.get "/:source_code/:code", data.chart
app.get "/api", data.api

http.createServer(app).listen app.get('port'), ->
  console.log "Listening on port #{app.get('port')}"

