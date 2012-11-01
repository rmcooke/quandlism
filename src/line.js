/**
 * Quandlism Line
 */
function QuandlismLine(context) {
  this.context = context;  
}

var QuandlismLine_ = QuandlismLine.prototype;
quandlism.line = QuandlismLine;


QuandlismContext_.line = function(data) {
  var context = this,
  line = new QuandlismLine(context),
  name = data.name,
  values = data.values.reverse(),
  id = quandlism_line_id++,
  visible = true;    

  
  /**
   * Getter / Setter methods
   *
   */
   
  line.id = function(_) {
   if (!arguments.length) {
     return id;
   }
   id = _;
   return line;
  }
  
  line.visible = function(_) {
    if (!arguments.length) {
      return visible;
    }
    visible = _;
    return line;
  }
  
  line.name = function(_) {
    if (!arguments.length) {
      return name;
    }
    name = _;
    return line;
  }
  
  /**
   * Instance methods for a line object
   *
   */
   
  /**
  * Draws a single point on the focus stage.
  *
  * color - The fill color of the circle
  * ctx - The HTML canvas elmenet to draw on
  * xS - Scale function for x axis
  * yS - Scale function for y axis
  * index - The data index for the point
  */
  line.drawPoint = function(color, ctx, xS, yS, index) {
   if (this.visible()) {
     ctx.beginPath();
     ctx.arc(xS(index), yS(this.valueAt(index)), 3, 0, Math.PI*2, true);
     ctx.fillStyle = color;
     ctx.fill();
     ctx.closePath();   
   }
  }
  
  /**
  * Draws the canvas path on the focus or brush chart
  *
  * color  - The hex color code of the line
  * ctx - The HTML canavs element to draw on
  * xS - The D3 scale for the xAxis
  * yS - The D3 scale for the yAxis
  * start - The first x-index to draw
  * end - The last x-index to draw
  * lineWidth - The width of the line to draw
  *
  * Return nil
  */
  line.drawPath = function(color, ctx, xS, yS, start, end, lineWidth) {  
   if (this.visible()) {
     ctx.beginPath();
     for (i = start; i <= end; i++) {
       ctx.lineTo(xS(i), yS(this.valueAt(i)));
     }  
     ctx.lineWidth = lineWidth;
     ctx.strokeStyle = color;
     ctx.stroke();
     ctx.closePath();
    } 
  }   
     
  /**
   * Caclulate the extent of the line, between start and end, if they are defined, or of the entire line, if they are not.
   *
   * start - An integer index representing the starting point of the extent we want
   * end - An integer index representing the end poitn of th extent we want
   *
   * Returns an array with two elements
   */
  line.extent = function(start, end) {
    var i = 0, 
    n = this.length() -1, 
    min = Infinity, 
    max = -Infinity,
    val;
  
    // If this line is not visible, then return extreme values so its ignored from calculation of total extent
    if (!this.visible()) {
      return [min, max];
    }
    if (start != null) {
      i = start;
    }
    if (end != null) {
      n = end;
    }
    while (i <= n) {
      val = this.valueAt(i);
      if (typeof(val) == 'undefined') {
        i++;
        continue;
      }
      if (val < min) {
        min = val;
      }
      if (val > max) {
        max = val;
      }
      i++;
    }
    return [min, max];
  }     
   
  /**
   * Toggle the visible state of the line. 
   *
   * Returns boolean, the stage that the line was togged to
   */
  line.toggle = function() {
    visibility = !this.visible();
    this.visible(visibility);
    return visibility;
  }
  

  /**
   * Returns the startDate of the line, the date of the first data point
   *
   * Returns a string representing a date
   */
  line.startDate = function() {
    return values[0].date;
  }
  
  /**
   * Returns the endDate of the line, the date of the last data point
   *
   * Returns a string representing a date
   */
  line.endDate = function() {
    return values[this.length() - 1].date;
  }
  
  
  /**
   * Returns the number value of the dataset corresponding to an array index
   *
   * i - The integer index 
   *
   * Returns an integer value
   */
  line.valueAt = function(i) {
    if (typeof(values[i]) === 'undefined') {
      return null;
    } else {
      return values[i].num;
    }
  }
  
  /**
   * Returns the date value of the dataset corresponding to an array index
   *
   * i - The integer index
   *
   * Returns a string reprenting a date
   */
  line.dateAt = function(i) {
    if (typeof(values[i]) === 'undefined') {
      return null;
    } else {
      return values[i].date;
    }
  }
  
  line.values = function() {
    return values;
  }
  
  line.length = function() {
    return values.length;
  }
  

  

  
  return line;
}


