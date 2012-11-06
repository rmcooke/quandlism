QuandlismContext_.utility = function() {
  
  var context = this;
  
  function utility() {}
  
  /**
   * Returns a string that can be parsed in the same format as the dates in the active graph.
   * The number of - present indicate one of two date formats available.
   * date - An example date
   *
   * Returns a string representing the date format
   */
  utility.dateFormat = function(date) {
    dateString = '';
    hyphenCount = date.split('-').length - 1;
    
    switch(hyphenCount) {
      case -1:
        dateString = '%Y';
        break;
      case 2:
        dateString = '%Y-%m-%d'
        break;
      default:
        throw("Unknown date format: " + hyphenCount + date);
    }
    return dateString;

  }
  
  /**
   * Calculates the extent for an array of quandlism line objects.
   * 
   * lines - The lines to be analyzed
   * start - An integer start index, or null, if the entire line should be analyzed
   * end - An integer end index, or null, if the entire line should be analyzed
   *
   * Returns an array with two number vales
   */
  utility.getExtent = function(lines, start, end) {
    exes = _.map(lines, function(line, j) {
      return line.extent(start, end);
    });     
    return [d3.min(exes, function(m) { return m[0]; }), d3.max(exes, function(m) { return m[1]; })]    
  }
  
  /**
   * Create an array of line objects
   *
   * data - The raw data returned from the Quandl API
   *
   * Returns an array of objects 
   */
  utility.createLines = function(data) {
    keys = _.without(data.columns, _.first(data.columns));
    lines =  _.map(keys, function(key, i) {
      return context.line({
        name: key,
        values: _.map(data.data, function(d) {
          return { date: d[0], num: +d[(i+1)] }
        })
      });
    }); 
    return lines;
  }
  
  /**
   * Parses the input date into a readable format for D3
   * String format is a function of the datasets frequency parameter
   *
   * date - A date to be parsed
   *
   * Return a time formatter
   */
  utility.parseDate = function(date) {
    dateString = this.dateFormat(date);
    return d3.time.format(dateString).parse;
  }
  
  /**
   * Given the coordinates of a point on a canvas element, return the pixel data
   *
   * m - An array with two elements, representing the x and y coordinates
   * ctx - The canvas element drawing context
   *
   * Return an RGB color hex
   */
  utility.getPixelRGB = function(m, ctx) {
    px = ctx.getImageData(m[0], m[1], 1, 1).data;
    rgb = d3.rgb(px[0], px[1], px[2]);
    return rgb.toString();
  }

  /**
   * Returns a hex colour code corresponding to the given index
   *
   * i - An integer index
   *
   * Returns a string representing a hex code
   */
  utility.getColor = function(i) {
     s = context.colorScale()
     return s(i);
  }
  
  
  return utility;
}
