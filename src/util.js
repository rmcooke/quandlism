QuandlismContext_.utility = function() {
  
  var context = this;
  
  function utility() {
    
  }
  
  utility.dateFormat = function() {
    dateString = '';
    switch(context.frequency()) {
      case 'daily':
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
   * Write this
   */
  utility.dateColumn = function(d) {
    if (typeof(d.Year) != 'undefined') {
      return 'Year';
    }
    if (typeof(d.Date != 'undefined')) {
      return 'Date';
    }
    throw('Error - Unknown date column');
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
  
  
  return utility;
}
