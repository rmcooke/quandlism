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
   *
   * Return an RGB color hex
   */
  utility.getPixelRGB = function(m) {
    px = ctx.getImageData(m[0], m[1], 1, 1).data;
    rgb = d3.rgb(px[0], px[1], px[2]);
    return rgb.toString();
  }

  

  /**
   * Get co-ordinates in the context of the canvas element, of the user click.
   * 
   * e - Browser mouse click event
   * c - The canvas element
   *
   * Returns an object with keys, x and y.
   */
  utility.getClickLocation = function(e, c) {
    var x, y;
    if (e.pageX || e.pageY) {
      x = e.pageX, y = e.pageY;
    } else {
      x = e.clientX + document.body.scrollLeft + document.documentElement.scrollLeft;
      y = e.clientY + document.body.scrollTop + document.documentElement.scrollTop;
    }
    x -= c.offsetLeft;
    y -= c.offsetTop;
    return {x: x, y: y};
    
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
