http = require 'http'
settings = require '../settings'

exports.chart = (req, res) ->
  code        = if req.query.code? then req.query.code else req.params.code ? null
  source_code = if req.query.source_code? then req.query.source_code else req.params.source_code ? null
  unless code? and source_code?
    throw "Source code and code are both required"
  res.render 'data/chart', source_code: source_code, code: code, page_title: "Quandlism Chart for #{source_code}/#{code}"

  
exports.api = (req, res) ->
  code = req.query.code
  source_code = req.query.source_code
  path = "api/v1/datasets/#{source_code}/#{code}?auth_token=#{settings.api_key}&format=json"
  console.log path
  options = 
    host: 'www.quandl.com'
    path: "/#{path}"
    port: 80,
    method: 'GET'
    
  body = ''
  request = http.request(options, (resp) ->
    console.log("STATUS: #{res.statusCode}")
    str = ""
    resp.on "data", (chunk) ->
      str += chunk
      
    resp.on "end", () ->
      res.send JSON.parse(str)
  ).end()
