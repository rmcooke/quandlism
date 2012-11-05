QuandlismContext_.utility = function() {
  
  var context = this;
  
  function utility() {}
  
  utility.dateFormat = function() {
    dateString = '';
    switch(context.frequency()) {
      case 'daily':
        dateString = '%Y-%m-%d';
        break;
      case 'weekly':
        dateString = '%Y-%m-%d';
        break;    
      case 'monthly':
        dateString = '%Y-%m-%d';
        break;
      case 'quarterly':
        dateString = '%Y-%m-%d';
        break;
      case 'annual':
        dateString = '%Y';
        break;
      default:
        throw('Error error');
    }
    return dateString;

  }
  
  /**
   * Parses the input date into a readable format for D3
   * String format is a function of the datasets frequency parameter
   *
   * Return a time formatter
   */
  utility.parseDate = function() {   
    dateString = this.dateFormat();
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
