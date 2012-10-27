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
   * Draws the canvas path on the focus or brush chart
   *
   * line   - The quanlism.line object
   * color  - The hex color code of the line
   * canvas - The HTML canavs element to draw on
   * xScale - The D3 scale for the xAxis
   * yScale - The D3 scale for the yAxis
   * start - The first x-index to draw
   * end - The last x-index to draw
   *
   * Return nil
   */
  utility.drawPath = function(line, color, canvas, xScale, yScale, start, end) {
    canvas.beginPath();
    canvas.moveTo(xScale(0), yScale(line.valueAt(0)));
    for (i = start; i <= end; i++) {
      canvas.lineTo(xScale(i), yScale(line.valueAt(i)));
    }  
    canvas.strokeStyle = color;
    canvas.stroke();
    canvas.closePath();
  }
  
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
