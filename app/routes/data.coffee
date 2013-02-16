exports.chart = (req, res) ->
  unless req.query.source_code? and req.query.code?
    throw "Source code and code are both required"
  code = req.query.code
  source_code = req.query.source_code
  res.render 'data/chart', source_code: source_code, code: code, page_title: "Quandlism Chart for #{source_code}/#{code}"